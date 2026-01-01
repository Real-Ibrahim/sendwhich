import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete user data
    await supabase.from('users').delete().eq('id', user.id)

    // Delete user account (this requires admin privileges in Supabase)
    // In production, you might want to use a service role key or Supabase admin API
    // For now, we'll just delete the user data and let them delete their auth account manually
    // or use Supabase dashboard

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}




