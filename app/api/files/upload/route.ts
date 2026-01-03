import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getFileType } from '@/lib/utils/room'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const room_id = formData.get('room_id') as string

    if (!file || !room_id) {
      return NextResponse.json({ error: 'Missing file or room_id' }, { status: 400 })
    }

    // Generate unique file path
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
    const filePath = `rooms/${room_id}/${fileName}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('files')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      if (uploadError.message.includes('Bucket not found') || uploadError.message.includes('not found')) {
        return NextResponse.json({ 
          error: 'Storage bucket "files" not found. Please create it in Supabase Dashboard → Storage → New bucket. See SETUP_STORAGE.md for instructions.' 
        }, { status: 500 })
      }
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // Get public URL for the file
    const { data: { publicUrl } } = supabase.storage
      .from('files')
      .getPublicUrl(filePath)

    // Log file in database
    const file_type = getFileType(file.name)
    const { data: fileLog, error: logError } = await supabase
      .from('file_logs')
      .insert({
        room_id,
        sender_id: user.id,
        file_name: file.name,
        file_type,
        file_size: file.size,
        file_path: filePath, // Store the storage path
      })
      .select()
      .single()

    if (logError) {
      // If logging fails, try to delete the uploaded file
      await supabase.storage.from('files').remove([filePath])
      return NextResponse.json({ error: logError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      fileLog: {
        ...fileLog,
        file_url: publicUrl
      }
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

