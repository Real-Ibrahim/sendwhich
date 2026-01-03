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

    const { searchParams } = new URL(req.url)
    const file_id = searchParams.get('file_id')

    if (!file_id) {
      return NextResponse.json({ error: 'file_id required' }, { status: 400 })
    }

    // Get file log using admin client to bypass RLS
    const adminSupabase = createAdminClient()
    const { data: fileLog, error: fileError } = await adminSupabase
      .from('file_logs')
      .select('*')
      .eq('id', file_id)
      .single()

    if (fileError || !fileLog) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    // Check if user has access to this room (is participant or owner)
    const { data: room } = await adminSupabase
      .from('rooms')
      .select('owner_id')
      .eq('id', fileLog.room_id)
      .single()

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 })
    }

    // Check if user is participant
    const { data: participant } = await adminSupabase
      .from('room_participants')
      .select('*')
      .eq('room_id', fileLog.room_id)
      .eq('user_id', user.id)
      .is('left_at', null)
      .single()

    const isOwner = room.owner_id === user.id
    const isParticipant = !!participant

    if (!isOwner && !isParticipant) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 })
    }

    // Download file from Supabase Storage
    if (!fileLog.file_path) {
      return NextResponse.json({ 
        error: 'File path not found. This file was uploaded before the file storage system was set up. Please upload the file again.' 
      }, { status: 404 })
    }

    const { data: fileData, error: downloadError } = await supabase.storage
      .from('files')
      .download(fileLog.file_path)

    if (downloadError) {
      if (downloadError.message.includes('Bucket not found') || downloadError.message.includes('not found')) {
        return NextResponse.json({ 
          error: 'Storage bucket "files" not found. Please create it in Supabase Dashboard → Storage → New bucket. See SETUP_STORAGE.md for instructions.' 
        }, { status: 500 })
      }
      return NextResponse.json({ error: downloadError.message || 'File download failed' }, { status: 500 })
    }

    if (!fileData) {
      return NextResponse.json({ error: 'File not found in storage' }, { status: 404 })
    }

    // Convert blob to buffer
    const arrayBuffer = await fileData.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Return file with proper headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': fileData.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${encodeURIComponent(fileLog.file_name)}"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

