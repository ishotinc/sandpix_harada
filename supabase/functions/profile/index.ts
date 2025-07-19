import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
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

    switch (req.method) {
      case 'GET':
        // Get user profile
        const { data: profile, error: getError } = await supabaseClient
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()

        if (getError && getError.code !== 'PGRST116') {
          return new Response(JSON.stringify({ error: getError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        // If no profile exists, create one
        if (!profile) {
          const { data: newProfile, error: createError } = await supabaseClient
            .from('profiles')
            .insert({
              user_id: user.id,
              personal_name: '',
              personal_bio: '',
              achievements: '',
              company_name: '',
              company_achievements: '',
              contact_info: '',
            })
            .select()
            .single()

          if (createError) {
            return new Response(JSON.stringify({ error: createError.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          return new Response(JSON.stringify({ profile: newProfile }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        return new Response(JSON.stringify({ profile }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      case 'PUT':
        // Update user profile
        const body = await req.json()
        
        // First check if profile exists
        const { data: existingProfile } = await supabaseClient
          .from('profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle()

        let updatedProfile
        let updateError

        if (existingProfile) {
          // Update existing profile
          const { data, error } = await supabaseClient
            .from('profiles')
            .update({
              personal_name: body.personal_name || '',
              personal_bio: body.personal_bio || '',
              achievements: body.achievements || '',
              company_name: body.company_name || '',
              company_achievements: body.company_achievements || '',
              contact_info: body.contact_info || '',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', user.id)
            .select()
            .single()
          
          updatedProfile = data
          updateError = error
        } else {
          // Create new profile if it doesn't exist
          const { data, error } = await supabaseClient
            .from('profiles')
            .insert({
              user_id: user.id,
              personal_name: body.personal_name || user.user_metadata?.full_name || '',
              personal_bio: body.personal_bio || '',
              achievements: body.achievements || '',
              company_name: body.company_name || '',
              company_achievements: body.company_achievements || '',
              contact_info: body.contact_info || user.email || '',
            })
            .select()
            .single()
          
          updatedProfile = data
          updateError = error
        }

        if (updateError) {
          return new Response(JSON.stringify({ error: updateError.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        return new Response(JSON.stringify({ profile: updatedProfile }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })

      default:
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
    }

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})