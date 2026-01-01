import { v4 as uuidv4 } from 'uuid'

export function generateRoomId(): string {
  return uuidv4()
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

export function getFileType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp']
  const videoTypes = ['mp4', 'webm', 'ogg', 'mov', 'avi', 'mkv']
  const documentTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf']
  const zipTypes = ['zip', 'rar', '7z', 'tar', 'gz']
  
  if (extension && imageTypes.includes(extension)) return 'image'
  if (extension && videoTypes.includes(extension)) return 'video'
  if (extension && documentTypes.includes(extension)) return 'document'
  if (extension && zipTypes.includes(extension)) return 'archive'
  
  return 'other'
}

export function isValidRoomId(id: string): boolean {
  // UUID v4 format validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(id)
}


