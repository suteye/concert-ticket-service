'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, Phone, User, CreditCard, Package, CheckCircle, DollarSign } from 'lucide-react'
import { Concert, DeliveryType } from '@/types'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function HirePage() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null)

  const [formData, setFormData] = useState({
    concert_id: '',
    x: '',
    round: '',
    ticket_count: 1,
    main_zone: '',
    backup_zone: '',
    use_customer_account: false,
    username: '',
    password: '',
    kplus_number: '',
    delivery_type: 'pickup' as DeliveryType,
    ticket_name: '',
    phone: '',
    notes: '',
  })

  useEffect(() => {
    fetchConcerts()
  }, [])

  const fetchConcerts = async () => {
    try {
      const response = await fetch('/api/concerts')
      const data = await response.json()
      // แสดงเฉพาะงานที่กำลังจะมาถึง
      const upcomingConcerts = data.filter((concert: Concert) => concert.status === 'upcoming')
      setConcerts(upcomingConcerts)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch concerts:', error)
      setLoading(false)
      toast.error('ไม่สามารถโหลดข้อมูลงานได้')
    }
  }

  const handleConcertSelect = (concertId: string) => {
    const concert = concerts.find(c => c.id === concertId)
    setSelectedConcert(concert || null)
    setFormData({ ...formData, concert_id: concertId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.concert_id || !formData.phone) {
      toast.error('กรุณากรอกข้อมูลที่จำเป็น')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          status: 'pending' // สถานะเริ่มต้นสำหรับลูกค้า
        }),
      })

      if (response.ok) {
        toast.success('ส่งคำขอจ้างสำเร็จ! เราจะติดต่อกลับภายใน 24 ชั่วโมง')
        // รีเซ็ตฟอร์ม
        setFormData({
          concert_id: '',
          x: '',
          round: '',
          ticket_count: 1,
          main_zone: '',
          backup_zone: '',
          use_customer_account: false,
          username: '',
          password: '',
          kplus_number: '',
          delivery_type: 'pickup',
          ticket_name: '',
          phone: '',
          notes: '',
        })
        setSelectedConcert(null)
      } else {
        toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลงาน...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            บริการจ้างกดบัตรคอนเสิร์ต
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            เราช่วยคุณจองบัตรคอนเสิร์ตที่คุณต้องการ ด้วยประสบการณ์และความเชี่ยวชาญ 
            รับประกันความสำเร็จในการจองบัตร
          </p>
        </div>

        {/* Available Concerts */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              งานที่เปิดให้บริการ
            </CardTitle>
          </CardHeader>
          <CardContent>
            {concerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>ขณะนี้ยังไม่มีงานเปิดให้บริการ</p>
                <p className="text-sm">กรุณาติดตามอัพเดทงานใหม่ๆ</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {concerts.map((concert) => (
                  <div
                    key={concert.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      selectedConcert?.id === concert.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleConcertSelect(concert.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {concert.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Clock className="w-4 h-4 mr-1" />
                          วันที่กดบัตร: {format(new Date(concert.event_date), 'PPPp', { locale: th })}
                        </div>
                        
                        {/* แสดงค่าบริการ */}
                        {concert.service_fee && (
                          <div className="flex items-center text-sm font-medium text-green-600 mb-2">
                            <DollarSign className="w-4 h-4 mr-1" />
                            ค่าบริการ: ฿{concert.service_fee.toLocaleString()} ต่อใบ
                          </div>
                        )}
                        
                        {concert.description && (
                          <p className="text-gray-600 text-sm">{concert.description}</p>
                        )}
                        {concert.event_url && (
                          <a
                            href={concert.event_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                            onClick={(e) => e.stopPropagation()}
                          >
                            ดูรายละเอียดงาน →
                          </a>
                        )}
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className="bg-green-100 text-green-800">
                          เปิดให้บริการ
                        </Badge>
                        {concert.service_fee && (
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-600">
                              ฿{concert.service_fee.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">ต่อใบ</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Form */}
        {selectedConcert && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  ข้อมูลการจ้าง - {selectedConcert.title}
                </div>
                {/* แสดงค่าบริการในหัวข้อ */}
                {selectedConcert.service_fee && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">ค่าบริการ</p>
                    <p className="text-xl font-bold text-green-600">
                      ฿{selectedConcert.service_fee.toLocaleString()}/ใบ
                    </p>
                  </div>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center">
                      <Phone className="w-4 h-4 mr-1" />
                      หมายเลขโทรศัพท์ *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="08xxxxxxxx"
                      required
                      className="text-lg"
                    />
                    <p className="text-xs text-gray-500">
                      เราจะติดต่อกลับผ่านหมายเลขนี้
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket_name">ชื่อบนบัตร</Label>
                    <Input
                      id="ticket_name"
                      value={formData.ticket_name}
                      onChange={(e) => setFormData({ ...formData, ticket_name: e.target.value })}
                      placeholder="ชื่อที่ต้องการให้แสดงบนบัตร"
                      className="text-lg"
                    />
                  </div>
                </div>

                {/* Ticket Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    ข้อมูลบัตรที่ต้องการ
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="ticket_count">จำนวนบัตร</Label>
                      <Select
                        value={formData.ticket_count.toString()}
                        onValueChange={(value) => setFormData({ ...formData, ticket_count: parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} ใบ
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="x">Account X</Label>
                      <Input
                        id="x"
                        value={formData.x}
                        onChange={(e) => setFormData({ ...formData, x: e.target.value })}
                        placeholder="@X ที่ใช้ในการจองบัตร"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="round">รอบ</Label>
                      <Input
                        id="round"
                        value={formData.round}
                        onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                        placeholder="เช่น 1, 2"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="main_zone">โซนที่ต้องการ (อันดับ 1)</Label>
                      <Input
                        id="main_zone"
                        value={formData.main_zone}
                        onChange={(e) => setFormData({ ...formData, main_zone: e.target.value })}
                        placeholder="เช่น A1, B2, VIP"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="backup_zone">โซนสำรอง (อันดับ 2)</Label>
                      <Input
                        id="backup_zone"
                        value={formData.backup_zone}
                        onChange={(e) => setFormData({ ...formData, backup_zone: e.target.value })}
                        placeholder="กรณีโซนแรกเต็ม"
                      />
                    </div>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Switch
                      checked={formData.use_customer_account}
                      onCheckedChange={(checked) => setFormData({ ...formData, use_customer_account: checked })}
                    />
                    <div>
                      <Label>ใช้ account ของฉันเอง</Label>
                      <p className="text-sm text-gray-500">
                        หากคุณมี account สำหรับซื้อบัตรอยู่แล้ว
                      </p>
                    </div>
                  </div>

                  {formData.use_customer_account && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username / อีเมล</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                          placeholder="username หรือ email ของคุณ"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          placeholder="รหัสผ่านของ account"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Services */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2" />
                    บริการเพิ่มเติม
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kplus_number">หมายเลข K Plus (ถ้ามี)</Label>
                      <Input
                        id="kplus_number"
                        value={formData.kplus_number}
                        onChange={(e) => setFormData({ ...formData, kplus_number: e.target.value })}
                        placeholder="สำหรับสะสมคะแนน"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="delivery_type">วิธีรับบัตร</Label>
                      <Select
                        value={formData.delivery_type}
                        onValueChange={(value: DeliveryType) => setFormData({ ...formData, delivery_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pickup">รับเอง (ฟรี)</SelectItem>
                          <SelectItem value="mail">ส่งทางไปรษณีย์ (+50 บาท)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Cost Summary - เพิ่มส่วนสรุปค่าใช้จ่าย */}
                {selectedConcert.service_fee && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                      <CreditCard className="w-4 h-4 mr-1" />
                      สรุปค่าใช้จ่าย
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">ค่าบริการ x {formData.ticket_count} ใบ:</span>
                        <span className="font-medium text-green-800">
                          ฿{(selectedConcert.service_fee * formData.ticket_count).toLocaleString()}
                        </span>
                      </div>
                      {formData.delivery_type === 'mail' && (
                        <div className="flex justify-between">
                          <span className="text-green-700">ค่าจัดส่ง:</span>
                          <span className="font-medium text-green-800">฿50</span>
                        </div>
                      )}
                      <hr className="border-green-300" />
                      <div className="flex justify-between text-base">
                        <span className="font-semibold text-green-800">รวมค่าบริการ:</span>
                        <span className="font-bold text-green-800">
                          ฿{(selectedConcert.service_fee * formData.ticket_count + 
                            (formData.delivery_type === 'mail' ? 50 : 0)).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-green-600 mt-2">
                        * ยังไม่รวมราคาบัตร (จ่ายตามราคาจริง)
                      </p>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุเพิ่มเติม</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={4}
                    placeholder="รายละเอียดเพิ่มเติม ข้อกำหนดพิเศษ หรือข้อสงสัย..."
                  />
                </div>

                {/* Terms and Submit */}
                <div className="space-y-4 pt-6 border-t">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <h4 className="font-semibold text-yellow-800 mb-2">
                      📋 เงื่อนไขการให้บริการ
                    </h4>
                    <ul className="text-sm text-yellow-700 space-y-1">
                      {selectedConcert.service_fee ? (
                        <>
                          <li>• ค่าบริการ: ฿{selectedConcert.service_fee.toLocaleString()} ต่อใบ</li>
                          <li>• ค่าจัดส่ง: ฿50 (กรณีส่งทางไปรษณีย์)</li>
                        </>
                      ) : (
                        <li>• ค่าบริการ: 300-500 บาท ขึ้นอยู่กับความยากงาน</li>
                      )}
                      <li>• ชำระเงินหลังได้บัตรสำเร็จเท่านั้น</li>
                      <li>• หากไม่สำเร็จจะไม่เก็บค่าบริการ</li>
                      <li>• ราคาบัตรต้องชำระตามราคาจริง</li>
                      <li>• รับผิดชอบในกรณีข้อมูลที่ให้มาไม่ถูกต้อง</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full py-3 text-lg font-semibold"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        กำลังส่ง...
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2" />
                        ยืนยัน
                        {selectedConcert.service_fee && (
                          <span className="ml-2 text-sm">
                            (฿{(selectedConcert.service_fee * formData.ticket_count + 
                              (formData.delivery_type === 'mail' ? 50 : 0)).toLocaleString()})
                          </span>
                        )}
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Contact Info */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">📞 ติดต่อเรา</h3>
              <p className="mb-4">หากมีข้อสงสัยหรือต้องการความช่วยเหลือ</p>
              <div className="flex justify-center space-x-6">
                <div>
                  <p className="font-semibold">โทรศัพท์</p>
                  <p>0xx-xxx-xxxx</p>
                </div>
                <div>
                  <p className="font-semibold">LINE ID</p>
                  <p>@wipeyeshop</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}