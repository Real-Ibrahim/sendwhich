import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFileType } from '@/lib/utils/room'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const body = await req.json()
    const { room_id, file_name, file_size } = body

    if (!room_id || !file_name || !file_size) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const file_type = getFileType(file_name)

    const { data: fileLog, error } = await supabase
      .from('file_logs')
      .insert({
        room_id,
        sender_id: user?.id || null,
        file_name,
        file_type,
        file_size,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ fileLog }, { status: 201 })
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

    const { data: fileLogs, error } = await supabase
      .from('file_logs')
      .select(`
        *,
        users:sender_id (id, username, email)
      `)
      .eq('room_id', room_id)
      .order('sent_at', { ascending: false })
      .limit(50)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ fileLogs: fileLogs || [] }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}








