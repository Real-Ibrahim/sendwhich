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
    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch (adminError: any) {
      console.error('Failed to create admin client:', adminError.message)
      // Provide helpful error message for missing service role key
      if (adminError.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        return NextResponse.json({ 
          error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env.local file. See SERVICE_ROLE_KEY_SETUP.md for instructions.' 
        }, { status: 500 })
      }
      return NextResponse.json({ 
        error: 'Server configuration error. Please check your environment variables.' 
      }, { status: 500 })
    }

    const { data: room, error } = await adminSupabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Check if room has expired and delete it
    const now = new Date()
    if (room.expires_at && new Date(room.expires_at) < now) {
      // Delete expired room
      await adminSupabase
        .from('rooms')
        .delete()
        .eq('id', id)
      
      return NextResponse.json({ error: 'This room has expired and been deleted' }, { status: 410 })
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
    console.error('Error in GET /api/rooms/[id]:', error)
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred while fetching the room' 
    }, { status: 500 })
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
    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch (adminError: any) {
      console.error('Failed to create admin client:', adminError.message)
      // Provide helpful error message for missing service role key
      if (adminError.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        return NextResponse.json({ 
          error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env.local file. See SERVICE_ROLE_KEY_SETUP.md for instructions.' 
        }, { status: 500 })
      }
      return NextResponse.json({ 
        error: 'Server configuration error. Please check your environment variables.' 
      }, { status: 500 })
    }

    const { data: room, error: roomError } = await adminSupabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Check if room has expired and delete it
    const now = new Date()
    if (room.expires_at && new Date(room.expires_at) < now) {
      // Delete expired room
      await adminSupabase
        .from('rooms')
        .delete()
        .eq('id', id)
      
      return NextResponse.json({ error: 'This room has expired and been deleted' }, { status: 410 })
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
    console.error('Error in POST /api/rooms/[id]:', error)
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 })
  }
}

export async function DELETE(
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

    // Use admin client to bypass RLS for room lookup
    let adminSupabase
    try {
      adminSupabase = createAdminClient()
    } catch (adminError: any) {
      console.error('Failed to create admin client:', adminError.message)
      if (adminError.message.includes('SUPABASE_SERVICE_ROLE_KEY')) {
        return NextResponse.json({ 
          error: 'Server configuration error: SUPABASE_SERVICE_ROLE_KEY is missing. Please add it to your .env.local file. See SERVICE_ROLE_KEY_SETUP.md for instructions.' 
        }, { status: 500 })
      }
      return NextResponse.json({ 
        error: 'Server configuration error. Please check your environment variables.' 
      }, { status: 500 })
    }

    // Get room to check ownership
    const { data: room, error: roomError } = await adminSupabase
      .from('rooms')
      .select('*')
      .eq('id', id)
      .single()

    if (roomError || !room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Only owner can delete the room
    if (room.owner_id !== user.id) {
      return NextResponse.json({ error: 'Only the room owner can delete this room' }, { status: 403 })
    }

    // Delete the room (cascade will delete related records)
    const { error: deleteError } = await adminSupabase
      .from('rooms')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Room deleted successfully' }, { status: 200 })
  } catch (error: any) {
    console.error('Error in DELETE /api/rooms/[id]:', error)
    return NextResponse.json({ 
      error: error.message || 'An unexpected error occurred' 
    }, { status: 500 })
  }
}








