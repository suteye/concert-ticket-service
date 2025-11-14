import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Ticket, Search, Shield, Clock, CheckCircle, Star,
  ArrowRight, Zap, Users, TrendingUp, Phone, Mail,
  Instagram, MessageCircle
} from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Ticket className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Wipeye Shop</span>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/hire" className="text-gray-600 hover:text-gray-900 transition">
                บริการของเรา
              </Link>
              <Link href="/track" className="text-gray-600 hover:text-gray-900 transition">
                ตรวจสอบสถานะ
              </Link>
              <Link href="#contact" className="text-gray-600 hover:text-gray-900 transition">
                ติดต่อเรา
              </Link>
              {/* <Link href="/admin/login">
                <Button variant="outline" size="sm">
                  เข้าสู่ระบบ
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              {/* <Badge className="mb-6 bg-blue-100 text-blue-700 hover:bg-blue-100">
                <Star className="w-3 h-3 mr-1" />
                บริการกดบัตรคอนเสิร์ตอันดับ 1
              </Badge> */}
              <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 leading-tight">
                จองบัตร<br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  คอนเสิร์ต
                </span>
                <br />
                ง่ายๆ กับเรา
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                บริการกดบัตรคอนเสิร์ตมืออาชีพ รวดเร็ว ปลอดภัย<br />
              
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link href="/hire">
                  <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8">
                    เริ่มจองเลย
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/track">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8">
                    <Search className="w-5 h-5 mr-2" />
                    ตรวจสอบสถานะ
                  </Button>
                </Link>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">งานที่สำเร็จ</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">95%</div>
                  <div className="text-sm text-gray-600">อัตราสำเร็จ</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">1,000+</div>
                  <div className="text-sm text-gray-600">ลูกค้าพึงพอใจ</div>
                </div>
              </div>
            </div>

            {/* Right Content - Visual */}
            <div className="relative">
              <div className="relative z-10">
                <Card className="shadow-2xl border-0">
                  <CardContent className="p-8">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white mb-6">
                      <h3 className="text-2xl font-bold mb-2">บริการกดบัตรด่วน</h3>
                      <p className="text-blue-100 mb-4">ระบบอัตโนมัติความเร็วสูง</p>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-5 h-5" />
                        <span className="text-sm">ตอบสนองภายใน 0.1 วินาที</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">ชำระหลังได้บัตร</div>
                          <div className="text-sm text-gray-500">ไม่สำเร็จไม่เก็บเงิน</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">ข้อมูลปลอดภัย</div>
                          <div className="text-sm text-gray-500">เข้ารหัสระดับธนาคาร</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">รวดเร็วทันใจ</div>
                          <div className="text-sm text-gray-500">Auto-booking ตอบสนองทันที</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              {/* Background decoration */}
              <div className="absolute top-10 right-10 w-72 h-72 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
              <div className="absolute bottom-10 left-10 w-72 h-72 bg-purple-200 rounded-full blur-3xl opacity-30"></div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-700 hover:bg-purple-100">
              ขั้นตอนง่ายๆ เพียง 3 ขั้น
            </Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">วิธีการใช้งาน</h2>
            <p className="text-xl text-gray-600">เริ่มจองบัตรได้ง่ายๆ ภายในไม่กี่นาที</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="w-14 h-14 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">เลือกงานที่ต้องการ</h3>
                <p className="text-gray-600 mb-6">
                  เลือกคอนเสิร์ตที่คุณต้องการจากรายการงานทั้งหมด พร้อมดูราคาค่าบริการ
                </p>
                <div className="flex items-center text-blue-600 font-semibold">
                  <Ticket className="w-5 h-5 mr-2" />
                  เลือกงาน
                </div>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-gray-300" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="w-14 h-14 bg-purple-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">กรอกข้อมูล</h3>
                <p className="text-gray-600 mb-6">
                  กรอกรายละเอียดการจอง เลือกโซน จำนวนบัตร และข้อมูลติดต่อของคุณ
                </p>
                <div className="flex items-center text-purple-600 font-semibold">
                  <Users className="w-5 h-5 mr-2" />
                  ใส่ข้อมูล
                </div>
              </div>
              {/* Connector */}
              <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                <ArrowRight className="w-8 h-8 text-gray-300" />
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition">
                <div className="w-14 h-14 bg-green-600 text-white rounded-xl flex items-center justify-center text-2xl font-bold mb-6">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">รอรับบัตร</h3>
                <p className="text-gray-600 mb-6">
                  เราจะติดต่อกลับภายใน 24 ชั่วโมง เมื่อได้บัตรแล้วค่อยชำระเงิน
                </p>
                <div className="flex items-center text-green-600 font-semibold">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  เสร็จสิ้น
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ทำไมต้องเลือกเรา?</h2>
            <p className="text-xl text-gray-600">บริการที่ครบครัน ตอบโจทย์ทุกความต้องการ</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">ระบบอัตโนมัติ</h3>
                <p className="text-gray-600 text-sm">
                  ใช้ระบบ Auto-booking ที่ทันสมัย ตอบสนองภายในมิลลิวินาที
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">ปลอดภัย 100%</h3>
                <p className="text-gray-600 text-sm">
                  ข้อมูลของคุณได้รับการเข้ารหัสและปกป้องอย่างปลอดภัย
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">อัตราสำเร็จสูง</h3>
                <p className="text-gray-600 text-sm">
                  มีอัตราความสำเร็จในการจองบัตรสูงถึง 95% จากประสบการณ์
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">บริการรวดเร็ว</h3>
                <p className="text-gray-600 text-sm">
                  ตอบกลับภายใน 24 ชั่วโมง พร้อมอัพเดทสถานะตลอดเวลา
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ลูกค้าพูดถึงเรา</h2>
            <p className="text-xl text-gray-600">ความพึงพอใจจากลูกค้าคือความภาคภูมิใจของเรา</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;ใช้บริการหลายครั้งแล้ว ได้บัตรทุกครั้งเลย รวดเร็วมาก ราคาก็เป็นธรรม แนะนำเลยค่ะ&quot;
                </p>
                <div className="font-semibold text-gray-900">คุณ A</div>
                <div className="text-sm text-gray-500">ลูกค้าประจำ</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;บริการดีมาก ทีมงานตอบเร็ว อัพเดทสถานะตลอด ได้บัตรโซนที่ต้องการเลย ประทับใจมาก&quot;
                </p>
                <div className="font-semibold text-gray-900">คุณ B</div>
                <div className="text-sm text-gray-500">ใช้บริการครั้งแรก</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                    <Star className="w-5 h-5 fill-current" />
                  </div>
                </div>
                <p className="text-gray-600 mb-4">
                  &quot;ระบบกดอัตโนมัติเร็วจริง ได้บัตรภายใน 1 นาทีหลังเปิดขาย ไว้ใจได้ครับ&quot;
                </p>
                <div className="font-semibold text-gray-900">คุณ C</div>
                <div className="text-sm text-gray-500">ลูกค้าVIP</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            พร้อมจองบัตรคอนเสิร์ตแล้วหรือยัง?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            เริ่มต้นใช้บริการวันนี้ รับประกันความสำเร็จ หรือคืนเงิน 100%
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/hire">
              <Button size="lg" className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 text-lg px-8">
                เริ่มจองเลย
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="#contact">
              <Button size="lg" variant="outline" className="w-full sm:w-auto border-white text-white hover:bg-white/10 text-lg px-8">
                <Phone className="w-5 h-5 mr-2" />
                ติดต่อสอบถาม
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">ติดต่อเรา</h2>
            <p className="text-xl text-gray-600">มีคำถาม? ติดต่อเราได้ทุกช่องทาง</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-2 border-gray-200 hover:border-blue-500 transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">โทรศัพท์</h3>
                <p className="text-gray-600 text-sm mb-2">0xx-xxx-xxxx</p>
                <p className="text-xs text-gray-500">จันทร์ - อาทิตย์ 9:00-22:00</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-green-500 transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-7 h-7 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">LINE</h3>
                <p className="text-gray-600 text-sm mb-2">@wipeyeshop</p>
                <p className="text-xs text-gray-500">ตอบกลับทันที</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-purple-500 transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Instagram className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Instagram</h3>
                <p className="text-gray-600 text-sm mb-2">@wipeyeshop</p>
                <p className="text-xs text-gray-500">DM ได้ตลอด 24/7</p>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-red-500 transition cursor-pointer">
              <CardContent className="p-6 text-center">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 text-sm mb-2">wipeyeshop@mail.com</p>
                <p className="text-xs text-gray-500">ตอบภายใน 24 ชม.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">WipEye Shop</span>
              </div>
              <p className="text-gray-400 text-sm">
                บริการกดบัตรคอนเสิร์ตมืออาชีพ ที่คุณไว้วางใจได้
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">บริการ</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/hire" className="hover:text-white transition">จองบัตร</Link></li>
                <li><Link href="/track" className="hover:text-white transition">ตรวจสอบสถานะ</Link></li>
                <li><Link href="#" className="hover:text-white transition">รีวิวลูกค้า</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">เกี่ยวกับเรา</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">เกี่ยวกับบริษัท</Link></li>
                <li><Link href="#" className="hover:text-white transition">วิธีการทำงาน</Link></li>
                <li><Link href="#contact" className="hover:text-white transition">ติดต่อเรา</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">นโยบาย</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#" className="hover:text-white transition">นโยบายความเป็นส่วนตัว</Link></li>
                <li><Link href="#" className="hover:text-white transition">ข้อกำหนดการให้บริการ</Link></li>
                <li><Link href="#" className="hover:text-white transition">นโยบายการคืนเงิน</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            <Link href="#" className="hover:text-white transition">นโยบายความเป็นส่วนตัว</Link>
            <Link href="#" className="hover:text-white transition">ข้อกำหนดการให้บริการ</Link>
            <Link href="#" className="hover:text-white transition">นโยบายการคืนเงิน</Link>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
            &copy; 2024 WipEye Shop. สงวนลิขสิทธิ์.
          </div>  
        </div>
      </footer>
    </div>
  )
}