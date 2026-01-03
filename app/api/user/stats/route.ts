import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get room count
    const { count: roomCount } = await supabase
      .from('rooms')
      .select('*', { count: 'exact', head: true })
      .eq('owner_id', user.id)

    // Get all file logs for rooms the user owns
    const { data: rooms } = await supabase
      .from('rooms')
      .select('id')
      .eq('owner_id', user.id)

    const roomIds = rooms?.map(r => r.id) || []

    const { data: allFileLogs } = roomIds.length > 0
      ? await supabase
          .from('file_logs')
          .select('file_size')
          .in('room_id', roomIds)
      : { data: [] }

    const totalFiles = allFileLogs?.length || 0
    const totalSize = allFileLogs?.reduce((sum, log) => sum + (log.file_size || 0), 0) || 0

    return NextResponse.json({
      stats: {
        totalRooms: roomCount || 0,
        totalFiles,
        totalSize,
      }
    }, { status: 200 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

