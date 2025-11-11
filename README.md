# 🎫 Concert Ticket Service - ระบบจ้างกดบัตรคอนเสิร์ต

ระบบบันทึกและจัดการการจ้างกดบัตรคอนเสิร์ต พัฒนาด้วย Next.js 14, TypeScript, Supabase และ NextAuth

## 🚀 Features

### ฝั่ง Admin (ผู้ดูแลระบบ)
- ✅ Login/Logout ด้วย NextAuth
- ✅ Dashboard แสดงสถิติภาพรวม
- ✅ จัดการงานคอนเสิร์ต (CRUD)
- ✅ จัดการลูกค้าในแต่ละงาน
- ✅ Calendar View แสดงงานทั้งหมด
- ✅ ระบบค้นหาและ Filter

### ฝั่งลูกค้า
- ✅ ฟอร์มจ้างงานกดบัตร (ไม่ต้อง Login)
- ✅ ตรวจสอบสถานะด้วยเบอร์โทร
- ✅ UI/UX ที่ใช้งานง่าย สวยงาม

## 📦 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS + Shadcn UI
- **Authentication**: NextAuth v5
- **Database**: Supabase (PostgreSQL)
- **Form Handling**: React Hook Form + Zod
- **State Management**: Zustand
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 🛠️ Installation

### 1. Clone และติดตั้ง Dependencies

```bash
git clone <your-repo>
cd concert-ticket-service
npm install
```

### 2. Environment Variables

สร้างไฟล์ `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here
```

สร้าง NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 3. รันโปรเจกต์

```bash
npm run dev
```

เปิด [http://localhost:3000](http://localhost:3000)

## 📱 การใช้งาน

### สำหรับลูกค้า

1. **จ้างงาน**: ไปที่ `/hire` กรอกฟอร์มจ้างงาน
2. **ตรวจสอบสถานะ**: ไปที่ `/track` ค้นหาด้วยเบอร์โทร

### สำหรับ Admin

1. **Login**: ไปที่ `/admin/login`
   - Email: admin@concert.com
   - Password: admin123 (หรือตามที่ตั้งไว้)

2. **Dashboard**: ดูภาพรวมงานทั้งหมด

3. **จัดการงาน**: `/admin/concerts`
   - เพิ่ม/แก้ไข/ลบ งานคอนเสิร์ต

4. **จัดการลูกค้า**: `/admin/concerts/[id]/customers`
   - เพิ่ม/แก้ไข/ลบ ลูกค้าในแต่ละงาน

5. **ปฏิทิน**: `/admin/calendar`
   - ดูงานทั้งหมดในรูปแบบปฏิทิน

## 🗂️ โครงสร้างโปรเจกต์

```
concert-ticket-service/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       ├── calendar/
│   │       ├── concerts/
│   │       ├── dashboard/
│   │       └── login/
│   ├── api/
│   │   ├── auth/
│   │   ├── concerts/
│   │   └── customers/
│   ├── hire/              # ฟอร์มจ้างงาน
│   ├── track/             # ตรวจสอบสถานะ
│   ├── layout.tsx
│   ├── page.tsx           # หน้าแรก
│   └── providers.tsx
├── components/
│   └── ui/                # Shadcn Components
├── lib/
│   ├── auth.ts           # NextAuth Config
│   ├── supabase.ts       # Supabase Client
│   └── utils.ts
├── types/
│   └── index.ts          # TypeScript Types
├── middleware.ts         # Route Protection
└── .env.local           # Environment Variables
```

## 🔐 Security

- ✅ Password hashing ด้วย bcryptjs
- ✅ JWT Session สำหรับ Authentication
- ✅ Route Protection ด้วย Middleware
- ✅ API Endpoint Authorization
- ✅ SQL Injection Protection (Supabase)

## 🎨 UI Components

ใช้ **Shadcn UI** Components:
- Button, Card, Dialog
- Input, Label, Select
- Switch, Calendar
- Table, Badge

## 📊 Database Schema

### Tables

1. **admins** - ผู้ดูแลระบบ
2. **concerts** - งานคอนเสิร์ต
3. **customers** - ลูกค้าที่จ้างงาน

### Relationships

- `customers.concert_id` → `concerts.id` (One-to-Many)
- Cascade Delete: ลบงานแล้วลูกค้าในงานนั้นจะถูกลบด้วย

## 🚀 Deployment

### Deploy บน Vercel

```bash
npm run build
vercel --prod
```

อย่าลืมตั้ง Environment Variables บน Vercel Dashboard

### Deploy Database บน Supabase

Database อยู่บน Supabase แล้ว ไม่ต้อง deploy แยก

## 🤝 Contributing

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License

## 📞 Support

หากมีปัญหาหรือข้อสงสัย:
- เปิด Issue บน GitHub
- ติดต่อทีมพัฒนา

---

Made with ❤️ by [Your Name]