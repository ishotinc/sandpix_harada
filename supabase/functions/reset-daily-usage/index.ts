import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Reset users whose last reset was > 24 hours ago
  const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
  
  const { error } = await supabase
    .from('profiles')
    .update({ 
      daily_generation_count: 0,
      daily_generation_reset_at: new Date().toISOString()
    })
    .or(`daily_generation_reset_at.is.null,daily_generation_reset_at.lt.${twentyFourHoursAgo}`)

  return new Response(JSON.stringify({ success: !error, error }))
})