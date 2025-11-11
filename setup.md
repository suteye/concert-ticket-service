# 🎫 Concert Ticket Service - Complete Setup Guide

## 📋 ขั้นตอนการติดตั้ง

### 1. สร้างโปรเจกต์ Next.js

```bash
npx create-next-app@latest concert-ticket-service
# เลือก: TypeScript ✅, Tailwind ✅, App Router ✅
cd concert-ticket-service
```

### 2. ติดตั้ง Dependencies

```bash
# UI & Styling
npx shadcn-ui@latest init
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-label @radix-ui/react-switch

# Authentication
npm install next-auth@beta bcryptjs
npm install -D @types/bcryptjs

# Database
npm install @supabase/supabase-js

# Form & Validation
npm install react-hook-form zod @hookform/resolvers

# State Management
npm install zustand

# Calendar
npm install react-day-picker date-fns

# Icons
npm install lucide-react
```

### 3. ติดตั้ง Shadcn Components

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add select
npx shadcn-ui@latest add switch
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add card
npx shadcn-ui@latest add table
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add form
npx shadcn-ui@latest add toast
```

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key_generate_with_openssl_rand_base64_32

# Database Connection (สำหรับ NextAuth Adapter ถ้าต้องการ)
DATABASE_URL=your_supabase_postgres_url
```

### 5. สร้าง Database Schema ใน Supabase

เข้า Supabase Dashboard → SQL Editor แล้วรันคำสั่งนี้:

```sql
-- ตารางผู้ดูแลระบบ
create table admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  password text not null,
  name text,
  created_at timestamp default now()
);

-- ตารางงานคอนเสิร์ต
create table concerts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  event_date timestamptz not null,
  event_url text,
  description text,
  status text default 'upcoming',
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- ตารางลูกค้าในแต่ละงาน
create table customers (
  id uuid primary key default gen_random_uuid(),
  concert_id uuid references concerts(id) on delete cascade,
  x text,
  round text,
  ticket_count int,
  main_zone text,
  backup_zone text,
  use_customer_account boolean default false,
  username text,
  password text,
  kplus_number text,
  delivery_type text,
  ticket_name text,
  price numeric,
  phone text not null,
  status text default 'pending',
  notes text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- สร้าง admin account ตัวอย่าง (password: admin123)
insert into admins (email, password, name) values 
('admin@concert.com', '$2a$10$XYz...', 'Admin User');

-- Index สำหรับ performance
create index idx_customers_concert_id on customers(concert_id);
create index idx_customers_phone on customers(phone);
create index idx_concerts_event_date on concerts(event_date);
```

**สำคัญ:** ต้อง hash password ก่อนใส่ใน DB จริง ใช้:
```bash
node -e "console.log(require('bcryptjs').hashSync('admin123', 10))"
```

### 6. โครงสร้างโฟลเดอร์

```
concert-ticket-service/
├── app/
│   ├── (admin)/
│   │   ├── admin/
│   │   │   ├── calendar/
│   │   │   │   └── page.tsx
│   │   │   ├── concerts/
│   │   │   │   ├── [id]/
│   │   │   │   │   └── customers/
│   │   │   │   │       └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx
│   │   │   └── login/
│   │   │       └── page.tsx
│   ├── (customer)/
│   │   ├── hire/
│   │   │   └── page.tsx
│   │   └── track/
│   │       └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── concerts/
│   │   │   └── route.ts
│   │   └── customers/
│   │       └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── admin/
│   │   ├── concert-form.tsx
│   │   ├── customer-form.tsx
│   │   ├── calendar-view.tsx
│   │   └── navbar.tsx
│   ├── customer/
│   │   ├── hire-form.tsx
│   │   └── track-form.tsx
│   └── ui/
│       └── (shadcn components)
├── lib/
│   ├── supabase.ts
│   ├── auth.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── middleware.ts
```

## ✅ Next Steps

หลังจากติดตั้งเรียบร้อย ฉันจะสร้างไฟล์โค้ดที่สำคัญให้ทีละส่วน:

1. ✅ Setup & Config files
2. 📝 Types & Database helpers
3. 🔐 Authentication (NextAuth)
4. 🎨 Admin UI Components
5. 👥 Customer UI Components
6. 🌐 API Routes
7. 📱 Pages (Admin & Customer)

พร้อมให้ฉันเริ่มสร้างไฟล์โค้ดหรือยัง?