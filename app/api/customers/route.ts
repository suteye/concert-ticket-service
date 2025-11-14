import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Customer, DeliveryType, CustomerStatus } from '@/types'

// GET - ดึงข้อมูลลูกค้าทั้งหมดหรือตาม concert_id
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const concertId = searchParams.get('concert_id')
    const id = searchParams.get('id')

    let query = supabaseAdmin.from('customers').select(`
      *,
      concert:concerts(*)
    `)

    // ถ้ามี id ให้ดึงลูกค้าคนเดียว
    if (id) {
      query = query.eq('id', id)
    }
    
    // ถ้ามี concert_id ให้กรองตามงาน
    if (concertId) {
      query = query.eq('concert_id', concertId)
    }

    // เรียงตามวันที่สร้างล่าสุด
    query = query.order('created_at', { ascending: false })

    const { data: customers, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 })
    }

    return NextResponse.json(customers || [])
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - เพิ่มลูกค้าใหม่
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.concert_id || !body.phone) {
      return NextResponse.json(
        { error: 'concert_id และ phone เป็นฟิลด์ที่จำเป็น' },
        { status: 400 }
      )
    }

    // เตรียมข้อมูลสำหรับ insert
    const customerData = {
      concert_id: body.concert_id,
      x: body.x || null,
      round: body.round || null,
      ticket_count: body.ticket_count || 1,
      main_zone: body.main_zone || null,
      backup_zone: body.backup_zone || null,
      use_customer_account: body.use_customer_account || false,
      username: body.username || null,
      password: body.password || null,
      kplus_number: body.kplus_number || null,
      delivery_type: body.delivery_type as DeliveryType || 'pickup',
      ticket_name: body.ticket_name || null,
      price: body.price || null,
      phone: body.phone,
      status: body.status as CustomerStatus || 'pending',
      notes: body.notes || null,
    }

    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .insert(customerData)
      .select(`
        *,
        concert:concerts(*)
      `)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 })
    }

    return NextResponse.json(customer, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - แก้ไขข้อมูลลูกค้า

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.id) {
      return NextResponse.json({ error: 'id เป็นฟิลด์ที่จำเป็น' }, { status: 400 })
    }

    const { id, created_at, updated_at, concert, ...updateData } = body

    updateData.updated_at = new Date().toISOString()

    for (const key in updateData) {
      if (updateData[key] === "") {
        updateData[key] = null
      }
    }

    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .update(updateData)
      .eq('id', id)
      .select(`*, concert:concerts(*)`)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update customer' }, { status: 500 })
    }

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    return NextResponse.json(customer)

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


// DELETE - ลบลูกค้า
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'id เป็นฟิลด์ที่จำเป็น' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('customers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete customer' }, { status: 500 })
    }

    return NextResponse.json({ message: 'ลบลูกค้าสำเร็จ' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}