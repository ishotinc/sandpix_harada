import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createGeminiClient } from './gemini-client.ts'
import { generateFinalPrompt } from './prompt-generator.ts'

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

    // Check daily usage limit (5 generations per day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const { count } = await supabaseServiceClient
      .from('generation_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('generated_at', today.toISOString())
      .eq('success', true)

    if (count !== null && count >= 5) {
      // Calculate time until reset (midnight UTC)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const hoursUntilReset = Math.ceil((tomorrow.getTime() - Date.now()) / (1000 * 60 * 60))
      
      return new Response(
        JSON.stringify({ 
          error: 'Daily limit reached',
          message: 'You\'ve reached your daily limit of 5 generations.',
          usage: { 
            current: count, 
            limit: 5,
            resetsIn: `${hoursUntilReset} hours`
          }
        }), 
        {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { projectData, swipeScores } = await req.json()

    // Get user profile for personalization
    const { data: profile } = await supabaseClient
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

    // Generate comprehensive prompt
    const prompt = generateFinalPrompt(projectData, profile || {}, swipeScores)

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
          error_message: generationError
        })
      
      throw error
    }

    // Log successful generation
    await supabaseServiceClient
      .from('generation_usage')
      .insert({
        user_id: user.id,
        success: true
      })

    // Return current usage with response
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    
    const { count: newCount } = await supabaseServiceClient
      .from('generation_usage')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('generated_at', todayStart.toISOString())
      .eq('success', true)

    return new Response(JSON.stringify({ 
      html,
      usage: {
        current: newCount || 0,
        limit: 5,
        remaining: 5 - (newCount || 0)
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