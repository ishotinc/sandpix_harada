import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Get current UTC date for standard daily reset at midnight UTC
  const now = new Date()
  const todayUTC = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const todayUTCString = todayUTC.toISOString().split('T')[0] // YYYY-MM-DD format
  
  // Reset all users' daily count and set reset date to today UTC
  // This ensures consistent daily reset timing regardless of when the function runs
  const { error } = await supabase
    .from('profiles')
    .update({ 
      daily_generation_count: 0,
      daily_generation_reset_at: todayUTCString
    })
    .neq('daily_generation_reset_at', todayUTCString) // Only update if not already reset today

  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .neq('daily_generation_reset_at', todayUTCString)

  return new Response(JSON.stringify({ 
    success: !error, 
    error,
    resetDate: todayUTCString,
    usersReset: count || 0,
    timestamp: now.toISOString()
  }))
})