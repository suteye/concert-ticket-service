"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  ChevronLeft,
  Music,
} from "lucide-react";
import { Concert, DeliveryType } from "@/types";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import toast from "react-hot-toast";
import Image from "next/image";

export default function HirePage() {
  const [concerts, setConcerts] = useState<Concert[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedConcert, setSelectedConcert] = useState<Concert | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

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
    setCurrentStep(2)
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, status: 'pending' }),
      })

      if (response.ok) {
        toast.success('ส่งคำขอจ้างสำเร็จ! เราจะติดต่อกลับภายใน 24 ชั่วโมง')
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
        setCurrentStep(1)
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

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  }

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลดข้อมูลงาน...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            {currentStep > 1 && (
              <Button
                variant="ghost"
                className="mr-2 sm:mr-4"
                onClick={() => setCurrentStep(1)}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="sr-only sm:not-sr-only sm:ml-1">กลับ</span>
              </Button>
            )}
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">เลือกงาน</h1>
              <p className="text-xs sm:text-sm text-gray-600">เลือกงานที่ต้องการจ้างกดบัตร</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-8">
              <div className="flex items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  currentStep >= 1 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <span className="ml-2 text-xs sm:text-sm font-medium text-gray-900">เลือกงาน</span>
              </div>
              <div className="flex items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  currentStep >= 2 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="ml-2 text-xs sm:text-sm font-medium text-gray-500">ข้อมูล</span>
              </div>
              <div className="flex items-center">
                <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                  currentStep >= 3 ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  3
                </div>
                <span className="ml-2 text-xs sm:text-sm font-medium text-gray-500">ยืนยัน</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Step 1: Concert Grid */}
        {currentStep === 1 && (
          <div className="space-y-6 sm:space-y-8">
            {concerts.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1 sm:mb-2">ขณะนี้ยังไม่มีงานเปิดให้บริการ</h3>
                <p className="text-sm text-gray-500">กรุณาติดตามงานใหม่ๆ ที่จะเปิดให้บริการ</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                {concerts.map((concert) => (
                  <div
                    key={concert.id}
                    className="group cursor-pointer"
                    onClick={() => handleConcertSelect(concert.id)}
                  >
                    <div className="relative aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                      {/* Concert Image */}
                      {concert.image_url ? (
                        <Image
                          src={concert.image_url}
                          alt={concert.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Music className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                        </div>
                      )}

                      {/* Overlay with service fee */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Service fee badge */}
                      {/* {concert.service_fee && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-900">
                          ฿{concert.service_fee.toLocaleString()}
                        </div>
                      )} */}

                      {/* Status badge */}
                      <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
                        เปิดให้บริการ
                      </div>
                    </div>

                    {/* Concert Info */}
                    <div className="mt-2 sm:mt-3 space-y-1">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-900 line-clamp-2 leading-tight">
                        {concert.title}
                      </h3>
                      {concert.service_fee ? (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">ค่ากดบัตร:</span>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">
                            ฿{concert.service_fee.toLocaleString()} - ฿{(concert.service_fee * 2).toLocaleString()}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Zone:</span>
                          <span className="text-xs sm:text-sm font-bold text-gray-900">
                            ฿300 - ฿500
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Step 2: Booking Form */}
        {currentStep === 2 && selectedConcert && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg">ข้อมูลการจอง</CardTitle>
                  <p className="text-xs sm:text-sm text-gray-500">{selectedConcert.title}</p>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <form onSubmit={(e) => { e.preventDefault(); nextStep(); }} className="space-y-4 sm:space-y-6">
                    {/* Contact Information */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">ข้อมูลติดต่อ</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="phone" className="text-xs sm:text-sm">หมายเลขโทรศัพท์ *</Label>
                          <Input
                            id="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            placeholder="08xxxxxxxx"
                            required
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="ticket_name" className="text-xs sm:text-sm">ชื่อบนบัตร</Label>
                          <Input
                            id="ticket_name"
                            value={formData.ticket_name}
                            onChange={(e) => setFormData({ ...formData, ticket_name: e.target.value })}
                            placeholder="ชื่อที่ต้องการแสดง"
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">รายละเอียดบัตร</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="ticket_count" className="text-xs sm:text-sm">จำนวนบัตร</Label>
                          <Select
                            value={formData.ticket_count.toString()}
                            onValueChange={(value) => setFormData({ ...formData, ticket_count: parseInt(value) })}
                          >
                            <SelectTrigger className="mt-1 text-sm sm:text-base">
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
                        <div>
                          <Label htmlFor="round" className="text-xs sm:text-sm">รอบ</Label>
                          <Input
                            id="round"
                            value={formData.round}
                            onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                            placeholder="เช่น 1, 2"
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="x" className="text-xs sm:text-sm">Account X</Label>
                          <Input
                            id="x"
                            value={formData.x}
                            onChange={(e) => setFormData({ ...formData, x: e.target.value })}
                            placeholder="@username"
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="main_zone" className="text-xs sm:text-sm">โซนที่ต้องการ (อันดับ 1)</Label>
                          <Input
                            id="main_zone"
                            value={formData.main_zone}
                            onChange={(e) => setFormData({ ...formData, main_zone: e.target.value })}
                            placeholder="เช่น A1, B2, VIP"
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="backup_zone" className="text-xs sm:text-sm">โซนสำรอง (อันดับ 2)</Label>
                          <Input
                            id="backup_zone"
                            value={formData.backup_zone}
                            onChange={(e) => setFormData({ ...formData, backup_zone: e.target.value })}
                            placeholder="กรณีโซนแรกเต็ม"
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Account Settings */}
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center space-x-3">
                        <Switch
                          checked={formData.use_customer_account}
                          onCheckedChange={(checked) => setFormData({ ...formData, use_customer_account: checked })}
                        />
                        <div>
                          <Label className="text-xs sm:text-sm">ใช้ account ของฉันเอง</Label>
                          <p className="text-xs text-gray-500">หากคุณมี account สำหรับซื้อบัตรอยู่แล้ว</p>
                        </div>
                      </div>

                      {formData.use_customer_account && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <div>
                            <Label htmlFor="username" className="text-xs sm:text-sm">Username / อีเมล</Label>
                            <Input
                              id="username"
                              value={formData.username}
                              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                              placeholder="username หรือ email"
                              className="mt-1 text-sm sm:text-base"
                            />
                          </div>
                          <div>
                            <Label htmlFor="password" className="text-xs sm:text-sm">Password</Label>
                            <Input
                              id="password"
                              type="password"
                              value={formData.password}
                              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                              placeholder="รหัสผ่าน"
                              className="mt-1 text-sm sm:text-base"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Additional Services */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">บริการเพิ่มเติม</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <Label htmlFor="kplus_number" className="text-xs sm:text-sm">หมายเลข K Plus (ถ้ามี)</Label>
                          <Input
                            id="kplus_number"
                            value={formData.kplus_number}
                            onChange={(e) => setFormData({ ...formData, kplus_number: e.target.value })}
                            placeholder="สำหรับสะสมคะแนน"
                            className="mt-1 text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <Label htmlFor="delivery_type" className="text-xs sm:text-sm">วิธีรับบัตร</Label>
                          <Select
                            value={formData.delivery_type}
                            onValueChange={(value: DeliveryType) => setFormData({ ...formData, delivery_type: value })}
                          >
                            <SelectTrigger className="mt-1 text-sm sm:text-base">
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

                    {/* Notes */}
                    <div>
                      <Label htmlFor="notes" className="text-xs sm:text-sm">หมายเหตุเพิ่มเติม</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        placeholder="รายละเอียดเพิ่มเติม..."
                        className="mt-1 text-sm sm:text-base"
                      />
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep} size="sm" className="text-xs sm:text-sm">
                        ย้อนกลับ
                      </Button>
                      <Button type="submit" className="bg-gray-900 hover:bg-gray-800 text-xs sm:text-sm">
                        ถัดไป
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Selected Concert */}
              <Card className="mb-4 sm:mb-6">
                <CardContent className="p-3 sm:p-4">
                  <div className="aspect-[3/4] relative mb-2 sm:mb-3 rounded-lg overflow-hidden">
                    {selectedConcert.image_url ? (
                      <Image
                        src={selectedConcert.image_url}
                        alt={selectedConcert.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Music className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">{selectedConcert.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                    {format(new Date(selectedConcert.event_date), 'PPP', { locale: th })}
                  </p>
                  {selectedConcert.description && (
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 line-clamp-2">{selectedConcert.description}</p>
                  )}
                </CardContent>
              </Card>

              {/* Pricing Summary */}
              <Card>
                <CardHeader className="px-4 py-3 sm:px-6 sm:py-4">
                  <CardTitle className="text-sm sm:text-lg">สรุปค่าใช้จ่าย</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-gray-600">ค่าบริการ</span>
                      <span className="font-medium text-xs sm:text-sm">
                        ฿{selectedConcert.service_fee
                          ? (selectedConcert.service_fee * formData.ticket_count).toLocaleString()
                          : '300-500'
                        }
                      </span>
                    </div>
                    {formData.delivery_type === 'mail' && (
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-gray-600">ค่าจัดส่ง</span>
                        <span className="font-medium text-xs sm:text-sm">฿50</span>
                      </div>
                    )}
                    <hr />
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm sm:text-base">รวม</span>
                      <span className="font-bold text-sm sm:text-lg">
                        ฿{selectedConcert.service_fee
                          ? (selectedConcert.service_fee * formData.ticket_count + (formData.delivery_type === 'mail' ? 50 : 0)).toLocaleString()
                          : '350-550'
                        }
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">* ยังไม่รวมราคาบัตร (จ่ายตามราคาจริง)</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {currentStep === 3 && selectedConcert && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg">ยืนยันการจอง</CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
                  <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                    {/* Booking Summary */}
                    <div className="space-y-3 sm:space-y-4">
                      <h3 className="font-medium text-gray-900 text-sm sm:text-base">สรุปการจอง</h3>
                      <div className="bg-gray-50 rounded-lg p-3 sm:p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">คอนเสิร์ต:</span>
                          <span className="font-medium text-xs sm:text-sm">{selectedConcert.title}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">จำนวนบัตร:</span>
                          <span className="font-medium text-xs sm:text-sm">{formData.ticket_count} ใบ</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">โซนที่ต้องการ:</span>
                          <span className="font-medium text-xs sm:text-sm">{formData.main_zone || 'ไม่ระบุ'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">วิธีรับบัตร:</span>
                          <span className="font-medium text-xs sm:text-sm">
                            {formData.delivery_type === 'pickup' ? 'รับเอง' : 'ส่งทางไปรษณีย์'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs sm:text-sm text-gray-600">โทรศัพท์:</span>
                          <span className="font-medium text-xs sm:text-sm">{formData.phone}</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                      <h4 className="font-medium text-yellow-800 mb-1 sm:mb-2 text-sm sm:text-base">เงื่อนไขการให้บริการ</h4>
                      <ul className="text-xs sm:text-sm text-yellow-700 space-y-1">
                        <li>• ชำระเงินหลังได้บัตรสำเร็จเท่านั้น</li>
                        <li>• หากไม่สำเร็จจะไม่เก็บค่าบริการ</li>
                        <li>• ราคาบัตรจ่ายตามราคาจริง</li>
                      </ul>
                    </div>

                    <div className="flex justify-between pt-4">
                      <Button type="button" variant="outline" onClick={prevStep} size="sm" className="text-xs sm:text-sm">
                        ย้อนกลับ
                      </Button>
                      <Button
                        type="submit"
                        disabled={submitting}
                        className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm"
                      >
                        {submitting ? 'กำลังส่ง...' : 'ยืนยันการจอง'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-3 sm:p-4">
                  <div className="aspect-[3/4] relative mb-2 sm:mb-3 rounded-lg overflow-hidden">
                    {selectedConcert.image_url ? (
                      <Image
                        src={selectedConcert.image_url}
                        alt={selectedConcert.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <Music className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1 sm:mb-2">{selectedConcert.title}</h3>
                  <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่าบริการรวม:</span>
                      <span className="font-bold">
                        ฿{selectedConcert.service_fee
                          ? (selectedConcert.service_fee * formData.ticket_count + (formData.delivery_type === 'mail' ? 50 : 0)).toLocaleString()
                          : '350-550'
                        }
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}