import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Ticket, Search, Shield } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block p-4 bg-white rounded-full shadow-lg mb-6">
            <Ticket className="w-16 h-16 text-blue-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🎫 Concert Ticket Service
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            บริการจ้างกดบัตรคอนเสิร์ต รวดเร็ว ปลอดภัย ไว้ใจได้
          </p>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link href="/hire">
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ticket className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">จ้างกดบัตร</h2>
                <p className="text-gray-600 mb-4">กรอกฟอร์มจ้างงานกดบัตรคอนเสิร์ต</p>
                <Button className="w-full">เริ่มจ้างงาน →</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/track">
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">ตรวจสอบสถานะ</h2>
                <p className="text-gray-600 mb-4">ค้นหาสถานะการจ้างงานของคุณ</p>
                <Button variant="outline" className="w-full">
                  ตรวจสอบเลย →
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/login">
            <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white">
              <CardContent className="pt-8 pb-8 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">เข้าสู่ระบบ Admin</h2>
                <p className="text-gray-600 mb-4">สำหรับผู้ดูแลระบบเท่านั้น</p>
                <Button variant="outline" className="w-full">
                  Login →
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-center mb-8">เหตุผลที่ควรใช้บริการเรา</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h4 className="font-bold mb-2">รวดเร็ว</h4>
              <p className="text-gray-600 text-sm">
                ใช้เทคโนโลยีและระบบอัตโนมัติในการกดบัตร
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h4 className="font-bold mb-2">ปลอดภัย</h4>
              <p className="text-gray-600 text-sm">
                ข้อมูลของคุณได้รับการเข้ารหัสและปกป้อง
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">💯</div>
              <h4 className="font-bold mb-2">ไว้ใจได้</h4>
              <p className="text-gray-600 text-sm">
                ประสบการณ์กดบัตรมาแล้วหลายร้อยงาน
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 text-gray-600">
          <p>© 2024 Concert Ticket Service. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}