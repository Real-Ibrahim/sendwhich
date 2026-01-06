import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword } from '@/lib/utils/password'
import { generateRoomId } from '@/lib/utils/room'
import { SupabaseClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, password, max_participants = 10, expires_at } = body

    const roomId = generateRoomId()
    const password_hash = password ? await hashPassword(password) : null

    const { data: room, error } = await supabase
      .from('rooms')
      .insert({
        id: roomId,
        owner_id: user.id,
        name: name || null,
        password_hash,
        max_participants,
        expires_at: expires_at || null,
        is_locked: !!password,
        status: 'active',
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Add owner as participant
    await supabase.from('room_participants').insert({
      room_id: roomId,
      user_id: user.id,
      role: 'owner',
    })

    return NextResponse.json({ room }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status') || 'active'
    const userId = user?.id

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get rooms where user is owner or participant
    const { data: rooms, error } = await supabase
      .from('rooms')
      .select(`
        *,
        room_participants!inner(user_id)
      `)
      .eq('room_participants.user_id', userId)
      .eq('status', status)
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Also get rooms owned by user
    const { data: ownedRooms } = await supabase
      .from('rooms')
      .select('*')
      .eq('owner_id', userId)
      .eq('status', status)

    // Merge and deduplicate
    const allRooms = [...(rooms || []), ...(ownedRooms || [])]
    const uniqueRooms = Array.from(
      new Map(allRooms.map(room => [room.id, room])).values()
    )

    // Check and mark expired rooms
    const now = new Date()
    let adminSupabase: SupabaseClient<any, "public", "public", any, any>
    try {
      adminSupabase = createAdminClient()
    } catch (adminError: any) {
      console.error('Failed to create admin client:', adminError.message)
    }

    const updatedRooms = await Promise.all(
      uniqueRooms.map(async (room) => {
        if (room.expires_at && new Date(room.expires_at) < now && room.status === 'active') {
          // Mark room as expired (don't delete from database)
          if (adminSupabase) {
            await adminSupabase
              .from('rooms')
              .update({ status: 'expired' })
              .eq('id', room.id)
          }
          return { ...room, status: 'expired' as const }
        }
        return room
      })
    )

    // Filter by status (only show active rooms by default, exclude expired and deleted)
    const filteredRooms = status === 'active' 
      ? updatedRooms.filter(r => r.status === 'active')
      : updatedRooms.filter(r => r.status === status)

    return NextResponse.json({ rooms: filteredRooms }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}