import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { verifyPassword } from '@/lib/utils/password'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()

    const { data: room, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Get participants
    const { data: participants } = await supabase
      .from('room_participants')
      .select(`
        *,
        users:user_id (id, username, email)
      `)
      .eq('room_id', id)
      .is('left_at', null)

    return NextResponse.json({ room, participants: participants || [] }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { password, action } = body

    // Get room
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    if (action === 'join') {
      // Verify password if room is locked
      if (room.is_locked && room.password_hash) {
        if (!password) {
          return NextResponse.json({ error: 'Password required' }, { status: 400 })
        }
        const isValid = await verifyPassword(password, room.password_hash)
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
        }
      }

      // Check if already a participant
      const { data: existing } = await supabase
        .from('room_participants')
        .select('*')
        .eq('room_id', id)
        .eq('user_id', user.id)
        .is('left_at', null)
        .single()

      if (!existing) {
        // Add participant
        await supabase.from('room_participants').insert({
          room_id: id,
          user_id: user.id,
          role: room.owner_id === user.id ? 'owner' : 'member',
        })
      }

      return NextResponse.json({ success: true }, { status: 200 })
    }

    if (action === 'update' && room.owner_id === user.id) {
      const { name, max_participants, expires_at, is_locked, password: newPassword } = body

      const updates: any = {}
      if (name !== undefined) updates.name = name
      if (max_participants !== undefined) updates.max_participants = max_participants
      if (expires_at !== undefined) updates.expires_at = expires_at
      if (is_locked !== undefined) updates.is_locked = is_locked

      if (newPassword) {
        const { hashPassword } = await import('@/lib/utils/password')
        updates.password_hash = await hashPassword(newPassword)
      }

      const { error: updateError } = await supabase
        .from('rooms')
        .update(updates)
        .eq('id', id)

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 })
      }

      return NextResponse.json({ success: true }, { status: 200 })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}




