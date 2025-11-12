import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ใช้ service role key เพื่ออัปโหลดไฟล์ได้
)

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData()
    const file = data.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    // ตรวจสอบว่าเป็นรูป
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
    }

    // จำกัดขนาดไม่เกิน 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 })
    }

    // แปลงเป็น Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // ตั้งชื่อไฟล์ไม่ซ้ำกัน
    const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

    // Upload ไปที่ Supabase Storage bucket: "concert-images"
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('concert-images')
      .upload(`uploads/${filename}`, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (uploadError) {
      console.error(uploadError)
      return NextResponse.json({ error: uploadError.message }, { status: 500 })
    }

    // ดึง URL แบบ public
    const {
      data: { publicUrl }
    } = supabase.storage.from('concert-images').getPublicUrl(`uploads/${filename}`)

    // ส่ง URL กลับไป
    return NextResponse.json({
      url: publicUrl,
      filename: filename
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
