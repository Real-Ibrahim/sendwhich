import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyPassword } from '@/lib/utils/password'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Use admin client to bypass RLS for room lookup (for P2P - anyone with link can view)
    // This allows users to join rooms even if they're not participants yet
    const adminSupabase = createAdminClient()
    const { data: room, error } = await adminSupabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Check if room has expired
    const now = new Date()
    if (room.expires_at && new Date(room.expires_at) < now && room.status === 'active') {
      // Update room status to expired
      await adminSupabase
        .from('rooms')
        .update({ status: 'expired' })
        .eq('id', id)
      
      room.status = 'expired'
    }

    // Prevent access to expired rooms
    if (room.status === 'expired') {
      return NextResponse.json({ error: 'This room has expired' }, { status: 410 })
    }

    // Get participants (use admin client to bypass RLS)
    const { data: participants } = await adminSupabase
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

    // Use admin client to bypass RLS for room lookup (for P2P - anyone with link can view)
    const adminSupabase = createAdminClient()
    const { data: room, error: roomError } = await adminSupabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Check if room has expired
    const now = new Date()
    if (room.expires_at && new Date(room.expires_at) < now && room.status === 'active') {
      // Update room status to expired
      await adminSupabase
        .from('rooms')
        .update({ status: 'expired' })
        .eq('id', id)
      
      return NextResponse.json({ error: 'This room has expired' }, { status: 410 })
    }

    // Prevent access to expired rooms
    if (room.status === 'expired') {
      return NextResponse.json({ error: 'This room has expired' }, { status: 410 })
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

      // Check if already a participant (use admin client)
      const { data: existing } = await adminSupabase
        .from('room_participants')
        .select('*')
        .eq('room_id', id)
        .eq('user_id', user.id)
        .is('left_at', null)
        .single()

      if (!existing) {
        // Add participant (use admin client to bypass RLS)
        await adminSupabase.from('room_participants').insert({
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

      // Use admin client for update (owner can update their rooms)
      const { error: updateError } = await adminSupabase
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








