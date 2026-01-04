import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Use admin client to bypass RLS and get ALL rooms (active, expired, deleted)
    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch (adminError: any) {
      console.error('Failed to create admin client:', adminError.message)
      // Fallback to regular client if admin client fails
      adminSupabase = supabase
    }

    // Get ALL room IDs where user is or was a participant or owner (including expired/deleted rooms)
    // Get all participant rooms (including those where user has left)
    const { data: participantRooms } = await adminSupabase
      .from('room_participants')
      .select('room_id')
      .eq('user_id', user.id)

    // Get all rooms owned by user (regardless of status - active, expired, deleted)
    const { data: ownedRooms } = await adminSupabase
      .from('rooms')
      .select('id, status')
      .eq('owner_id', user.id)

    // Get all rooms where user is a participant (regardless of status)
    const participantRoomIds = participantRooms?.map(r => r.room_id) || []
    const ownedRoomIds = ownedRooms?.map(r => r.id) || []

    const roomIds = [...participantRoomIds, ...ownedRoomIds]

    // Remove duplicates
    const uniqueRoomIds = Array.from(new Set(roomIds))

    if (uniqueRoomIds.length === 0) {
      return NextResponse.json({ activities: [] }, { status: 200 })
    }

    // Get file logs for ALL rooms (including expired/deleted) using admin client
    const { data: fileLogs, error } = await adminSupabase
      .from('file_logs')
      .select(`
        *,
        rooms:room_id (id, name, status),
        users:sender_id (id, username, email)
      `)
      .in('room_id', uniqueRoomIds)
      .order('sent_at', { ascending: false })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ activities: fileLogs || [] }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

