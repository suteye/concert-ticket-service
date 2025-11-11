import bcrypt from 'bcryptjs'
import { supabaseAdmin } from './supabase'

// สำหรับการสร้าง admin ใหม่ (ใช้ใน script หรือ admin panel)
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12
  return await bcrypt.hash(password, saltRounds)
}

// ตรวจสอบรหัสผ่าน
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword)
}

// สร้าง admin ใหม่
export const createAdmin = async (email: string, password: string, name?: string) => {
  const hashedPassword = await hashPassword(password)
  
  const { data, error } = await supabaseAdmin
    .from('admins')
    .insert({
      email,
      password: hashedPassword,
      name: name || null
    })
    .select()
    .single()

  if (error) throw error
  return data
}