import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createGeminiClient } from './gemini-client.ts'
import { generateFinalPrompt } from './prompt-generator.ts'
import { PLAN_LIMITS } from '../_shared/constants.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // Create service role client for usage tracking
    const supabaseServiceClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get user profile with plan info and admin status
    const { data: profile } = await supabaseServiceClient
      .from('profiles')
      .select('plan_type, daily_generation_count, daily_generation_reset_at, daily_project_count')
      .eq('user_id', user.id)
      .single()

    const { data: userData } = await supabaseServiceClient
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    const isAdmin = userData?.is_admin || false
    const planType = profile?.plan_type || 'free'
    const limits = PLAN_LIMITS[planType]

    // Skip limits for admin
    if (!isAdmin) {
      // Check if reset needed
      const lastReset = profile?.daily_generation_reset_at ? new Date(profile.daily_generation_reset_at) : null
      const now = new Date()
      const needsReset = !lastReset || (now.getTime() - lastReset.getTime() > 24 * 60 * 60 * 1000)
      
      if (needsReset) {
        await supabaseServiceClient
          .from('profiles')
          .update({ 
            daily_generation_count: 0,
            daily_project_count: 0,
            daily_generation_reset_at: now.toISOString()
          })
          .eq('user_id', user.id)
        profile.daily_generation_count = 0
        profile.daily_project_count = 0
      }

      if (profile.daily_generation_count >= limits.dailyGenerations) {
        const resetsAt = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000)
        return new Response(
          JSON.stringify({ 
            error: `Daily generation limit reached. ${limits.displayName} allows ${limits.dailyGenerations} generations per day.`,
            usage: {
              used: profile.daily_generation_count,
              limit: limits.dailyGenerations,
              resetsAt: resetsAt.toISOString()
            }
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }

      // Project limit check for Plus users
      if (planType === 'plus' && profile.daily_project_count >= limits.maxProjects) {
        const resetsAt = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000)
        return new Response(
          JSON.stringify({ 
            error: `Daily project creation limit reached. ${limits.displayName} allows ${limits.maxProjects} new projects per day.`,
            usage: {
              projects_used: profile.daily_project_count,
              projects_limit: limits.maxProjects,
              resetsAt: resetsAt.toISOString()
            }
          }),
          {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    const { projectData, swipeScores, language: requestLanguage, purpose: requestPurpose } = await req.json()

    // Extract language and purpose from request body (not from projectData)
    const language = requestLanguage || 'ja'
    const purpose = requestPurpose || projectData.purpose || 'product'

    // Get full user profile for personalization
    const { data: fullProfile } = await supabaseClient
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    // Get Gemini API key from environment
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY')
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not configured')
    }

    // Create Gemini client
    const geminiClient = createGeminiClient(geminiApiKey)

    // Generate comprehensive prompt with language and purpose
    console.log('Generating prompt with data:', {
      projectDataKeys: Object.keys(projectData),
      swipeScoresKeys: Object.keys(swipeScores),
      language,
      purpose,
      planType
    })
    
    const prompt = generateFinalPrompt(projectData, fullProfile || {}, swipeScores, planType, language, purpose)
    
    console.log('Generated prompt length:', prompt.length)
    console.log('Prompt preview (first 500 chars):', prompt.substring(0, 500))

    // Generate landing page HTML using Gemini AI
    console.log('Generating landing page with AI...')
    let html: string
    let generationError: string | null = null
    
    try {
      html = await geminiClient.generateLandingPage(prompt)
    } catch (error) {
      generationError = error.message
      // Log failed generation attempt
      await supabaseServiceClient
        .from('generation_usage')
        .insert({
          user_id: user.id,
          success: false,
          error_message: generationError,
          plan_type: planType
        })
      
      throw error
    }

    // Log successful generation and increment count
    await supabaseServiceClient
      .from('generation_usage')
      .insert({
        user_id: user.id,
        success: true,
        plan_type: planType
      })

    // Increment daily generation count if not admin
    if (!isAdmin) {
      await supabaseServiceClient
        .from('profiles')
        .update({ daily_generation_count: (profile?.daily_generation_count || 0) + 1 })
        .eq('user_id', user.id)

      // For Plus plan, increment project count
      if (planType === 'plus') {
        const { error: rpcError } = await supabaseServiceClient.rpc('increment_project_count', { user_id: user.id })
        if (rpcError) {
          console.error('Failed to increment project count:', rpcError)
        }
      }
    }

    // Return current usage with response
    const currentUsage = isAdmin ? 0 : (profile?.daily_generation_count || 0) + 1
    const dailyLimit = isAdmin ? 999 : limits.dailyGenerations

    return new Response(JSON.stringify({ 
      html,
      usage: {
        current: currentUsage,
        limit: dailyLimit,
        remaining: dailyLimit - currentUsage,
        isAdmin: isAdmin
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    console.error('Generation error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})