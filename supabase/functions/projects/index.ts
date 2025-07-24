import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { PLAN_LIMITS } from '../_shared/constants.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
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

    const url = new URL(req.url)
    const pathname = url.pathname
    
    // Extract the path after /projects/
    // The function is invoked at /functions/v1/projects but the pathname only shows /projects
    const basePath = '/projects'
    const apiPath = pathname.startsWith(basePath + '/') 
      ? pathname.slice(basePath.length + 1) 
      : pathname === basePath 
        ? '' 
        : ''
    
    switch (req.method) {
      case 'GET':
        if (apiPath === '') {
          // GET /api/projects - List user's projects
          const { data: { user } } = await supabaseClient.auth.getUser()
          if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          const { data: projects, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          return new Response(JSON.stringify({ projects }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        
        // GET /api/projects/:id - Get specific project
        const projectId = apiPath
        if (projectId) {
          const { data: { user } } = await supabaseClient.auth.getUser()
          if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          const { data: project, error } = await supabaseClient
            .from('projects')
            .select('*')
            .eq('id', projectId)
            .eq('user_id', user.id)
            .single()

          if (error) {
            return new Response(JSON.stringify({ error: 'Project not found' }), {
              status: 404,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          return new Response(JSON.stringify({ project }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        break

      case 'POST':
        if (apiPath === '') {
          // POST /api/projects - Create new project
          const { data: { user } } = await supabaseClient.auth.getUser()
          if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          const body = await req.json()
          
          // Get user profile with plan info
          const { data: profile } = await supabaseClient
            .from('profiles')
            .select('plan_type, project_count')
            .eq('user_id', user.id)
            .single()

          const planType = profile?.plan_type || 'free'
          const currentProjectCount = profile?.project_count || 0
          const limits = PLAN_LIMITS[planType]
          
          if (currentProjectCount >= limits.maxProjects) {
            return new Response(JSON.stringify({ 
              error: `Project limit reached. ${limits.displayName} allows maximum ${limits.maxProjects} projects.`,
              requiresUpgrade: planType === 'free'
            }), {
              status: 403,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          const { data: project, error } = await supabaseClient
            .from('projects')
            .insert({
              user_id: user.id,
              service_name: body.service_name,
              purpose: body.purpose || 'service',
              language: body.language || 'ja',
              service_description: body.service_description || '',
              redirect_url: body.redirect_url || '',
              cta_text: body.cta_text || 'Get Started',
              generated_html: body.generated_html || '',
              is_published: body.is_published || false,
              is_public: body.is_public !== false,
            })
            .select()
            .single()

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          // Increment project count
          await supabaseClient
            .from('profiles')
            .update({ project_count: currentProjectCount + 1 })
            .eq('user_id', user.id)

          return new Response(JSON.stringify({ project }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        break

      case 'PUT':
        // PUT /api/projects/:id - Update project
        const updateProjectId = apiPath
        if (updateProjectId) {
          const { data: { user } } = await supabaseClient.auth.getUser()
          if (!user) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          const body = await req.json()
          
          const { data: project, error } = await supabaseClient
            .from('projects')
            .update({
              service_name: body.service_name,
              purpose: body.purpose,
              language: body.language,
              service_description: body.service_description,
              redirect_url: body.redirect_url,
              cta_text: body.cta_text,
              main_copy: body.main_copy,
              service_achievements: body.service_achievements,
              custom_head: body.custom_head,
              custom_body: body.custom_body,
              generated_html: body.generated_html,
              is_published: body.is_published,
              is_public: body.is_public,
              updated_at: new Date().toISOString(),
            })
            .eq('id', updateProjectId)
            .eq('user_id', user.id)
            .select()
            .single()

          if (error) {
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            })
          }

          return new Response(JSON.stringify({ project }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        break

      case 'DELETE':
        // DELETE /api/projects/:id - Delete project
        console.log('DELETE request received')
        console.log('Full URL:', req.url)
        console.log('Pathname:', pathname)
        console.log('apiPath:', apiPath)
        
        const deleteProjectId = apiPath
        if (!deleteProjectId) {
          return new Response(JSON.stringify({ error: 'Project ID required' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        
        // Log the project ID for debugging
        console.log('Extracted project ID:', deleteProjectId)
        console.log('Project ID length:', deleteProjectId.length)
        
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) {
          return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 401,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        
        const { data: deletedRows, error } = await supabaseClient
          .from('projects')
          .delete()
          .eq('id', deleteProjectId)
          .eq('user_id', user.id)
          .select()

        if (error) {
          console.error('Delete error:', error)
          return new Response(JSON.stringify({ 
            error: error.message,
            debug: {
              receivedId: deleteProjectId,
              idLength: deleteProjectId.length,
              fullUrl: req.url,
              pathname: pathname,
              apiPath: apiPath
            }
          }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }
        
        // Check if any rows were actually deleted
        if (!deletedRows || deletedRows.length === 0) {
          return new Response(JSON.stringify({ error: 'Project not found or unauthorized' }), {
            status: 404,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          })
        }

        // Decrement project count
        const { data: profile } = await supabaseClient
          .from('profiles')
          .select('project_count')
          .eq('user_id', user.id)
          .single()

        if (profile && profile.project_count > 0) {
          await supabaseClient
            .from('profiles')
            .update({ project_count: profile.project_count - 1 })
            .eq('user_id', user.id)
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
        
      default:
        break
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})