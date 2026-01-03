import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all room IDs where user is a participant or owner
    const { data: participantRooms } = await supabase
      .from('room_participants')
      .select('room_id')
      .eq('user_id', user.id)
      .is('left_at', null)

    const { data: ownedRooms } = await supabase
      .from('rooms')
      .select('id')
      .eq('owner_id', user.id)

    const roomIds = [
      ...(participantRooms?.map(r => r.room_id) || []),
      ...(ownedRooms?.map(r => r.id) || [])
    ]

    if (roomIds.length === 0) {
      return NextResponse.json({ activities: [] }, { status: 200 })
    }

    // Get file logs for all rooms
    const { data: fileLogs, error } = await supabase
      .from('file_logs')
      .select(`
        *,
        rooms:room_id (id, name),
        users:sender_id (id, username, email)
      `)
      .in('room_id', roomIds)
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

