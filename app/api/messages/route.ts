import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const { room_id, content, type = 'text' } = body

    if (!room_id || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        room_id,
        sender_id: user?.id || null,
        content,
        type,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(req.url)
    const room_id = searchParams.get('room_id')

    if (!room_id) {
      return NextResponse.json({ error: 'room_id required' }, { status: 400 })
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select(`
        *,
        users:sender_id (id, username, email)
      `)
      .eq('room_id', room_id)
      .order('created_at', { ascending: true })
      .limit(100)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ messages: messages || [] }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}








