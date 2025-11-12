import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

//GET - ดึงรายการคอนเสิร์ตทั้งหมด
export async function GET(request: NextRequest) {
  try {
    const { data, error } = await supabase
      .from('concerts')
      .select('*')
      .order('event_date', { ascending: true })

    if (error) throw error

    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch concerts' }, { status: 500 })
  }
}

//POST - สร้างคอนเสิร์ตใหม่ (ต้องล็อกอิน)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();

    const { data: concert, error } = await supabaseAdmin
      .from('concerts')
      .insert([{
        title: body.title,
        event_date: body.event_date,
        event_url: body.event_url,
        description: body.description,
        service_fee: body.service_fee,
        image_url: body.image_url,
        status: body.status
      }])
      .select()
      .single()

    if (error) throw error;

    return NextResponse.json(concert, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create concert' }, { status: 500 });
  }
}

// PUT - อัพเดทคอนเสิร์ต
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    const { data, error } = await supabaseAdmin
      .from('concerts')
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update concert' }, { status: 500 });
  }
}

// DELETE - ลบคอนเสิร์ต
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Concert ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from('concerts').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({ message: 'Concert deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete concert' }, { status: 500 });
  }
}