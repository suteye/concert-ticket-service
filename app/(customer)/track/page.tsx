'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Search, Phone, Calendar, MapPin, Package, Clock, CheckCircle, AlertCircle, Truck } from 'lucide-react'
import { Customer, CustomerWithConcert } from '@/types'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import toast from 'react-hot-toast'

export default function TrackPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [customerData, setCustomerData] = useState<CustomerWithConcert[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!phoneNumber.trim()) {
      toast.error('กรุณากรอกหมายเลขโทรศัพท์')
      return
    }

    setLoading(true)
    
    try {
      const response = await fetch(`/api/customers/track?phone=${encodeURIComponent(phoneNumber)}`)
      const data = await response.json()
      
      if (response.ok) {
        setCustomerData(data)
        setSearched(true)
        if (data.length === 0) {
          toast.error('ไม่พบข้อมูลการจ้างด้วยหมายเลขนี้')
        } else {
          toast.success(`พบข้อมูลการจ้าง ${data.length} รายการ`)
        }
      } else {
        toast.error('เกิดข้อผิดพลาดในการค้นหา')
      }
    } catch (error) {
      console.error('Search error:', error)
      toast.error('เกิดข้อผิดพลาดในการเชื่อมต่อ')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            รอดำเนินการ
          </Badge>
        )
      case 'paid':
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800 flex items-center">
            <AlertCircle className="w-3 h-3 mr-1" />
            ชำระแล้ว
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800 flex items-center">
            <CheckCircle className="w-3 h-3 mr-1" />
            สำเร็จ
          </Badge>
        )
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'pending':
        return 'เรากำลังดำเนินการจองบัตรให้คุณ กรุณารอการยืนยัน'
      case 'paid':
        return 'ได้รับการชำระเงินแล้ว กำลังจัดส่งบัตร'
      case 'completed':
        return 'การจองสำเร็จเรียบร้อย บัตรได้ส่งมอบแล้ว'
      default:
        return 'ข้อมูลสถานะ'
    }
  }

  const getDeliveryStatus = (customer: CustomerWithConcert) => {
    if (customer.status === 'completed' && customer.delivery_type === 'mail') {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <Truck className="w-4 h-4 mr-1" />
          จัดส่งแล้ว
        </div>
      )
    }
    if (customer.status === 'completed' && customer.delivery_type === 'pickup') {
      return (
        <div className="flex items-center text-green-600 text-sm">
          <CheckCircle className="w-4 h-4 mr-1" />
          รับแล้ว
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ติดตามการจ้างกดบัตร
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            ตรวจสอบสถานะการจ้าง ที่นั่ง และหมายเลขพัสดุ
          </p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="w-5 h-5 mr-2" />
              ค้นหาด้วยหมายเลขโทรศัพท์
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="phone" className="sr-only">หมายเลขโทรศัพท์</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="กรอกหมายเลขโทรศัพท์ เช่น 0812345678"
                  className="text-lg h-12"
                  disabled={loading}
                />
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="h-12 px-8"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    ค้นหา...
                  </div>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    ค้นหา
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {searched && (
          <div className="space-y-6">
            {customerData.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">
                    ไม่พบข้อมูลการจ้าง
                  </h3>
                  <p className="text-gray-500 mb-4">
                    ไม่พบข้อมูลการจ้างกดบัตรด้วยหมายเลขโทรศัพท์นี้
                  </p>
                  <p className="text-sm text-gray-400">
                    กรุณาตรวจสอบหมายเลขอีกครั้ง หรือติดต่อเราเพื่อสอบถาม
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  ข้อมูลการจ้าง ({customerData.length} รายการ)
                </h2>
                
                {customerData.map((customer) => (
                  <Card key={customer.id} className="overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">
                            {customer.concert?.title}
                          </CardTitle>
                          <div className="flex items-center text-blue-100">
                            <Calendar className="w-4 h-4 mr-2" />
                            {customer.concert && format(new Date(customer.concert.event_date), 'PPPp', { locale: th })}
                          </div>
                        </div>
                        {getStatusBadge(customer.status)}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6">
                      {/* Status Description */}
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700">{getStatusDescription(customer.status)}</p>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Column - Order Details */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            รายละเอียดการจ้าง
                          </h3>
                          
                          <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">รหัสการจ้าง:</span>
                              <span className="font-mono text-gray-900">#{customer.id.slice(-8).toUpperCase()}</span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">หมายเลขโทรศัพท์:</span>
                              <span className="font-medium">{customer.phone}</span>
                            </div>
                            
                            {customer.ticket_name && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">ชื่อบนบัตร:</span>
                                <span className="font-medium">{customer.ticket_name}</span>
                              </div>
                            )}
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">จำนวนบัตร:</span>
                              <span className="font-medium">{customer.ticket_count || 1} ใบ</span>
                            </div>
                            
                            {customer.price && (
                              <div className="flex justify-between">
                                <span className="text-gray-600">ราคารวม:</span>
                                <span className="font-bold text-green-600">฿{customer.price.toLocaleString()}</span>
                              </div>
                            )}
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">วิธีรับบัตร:</span>
                              <span className="font-medium">
                                {customer.delivery_type === 'pickup' ? 'รับเอง' : 'ส่งทางไปรษณีย์'}
                              </span>
                            </div>
                            
                            <div className="flex justify-between">
                              <span className="text-gray-600">วันที่จ้าง:</span>
                              <span>{format(new Date(customer.created_at), 'PP', { locale: th })}</span>
                            </div>
                          </div>
                        </div>

                        {/* Right Column - Seat Info & Delivery */}
                        <div className="space-y-4">
                          <h3 className="font-semibold text-gray-900 flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            ข้อมูลที่นั่ง
                          </h3>
                          
                          {customer.status === 'completed' ? (
                            <div className="space-y-3">
                              {(customer.main_zone || customer.backup_zone) && (
                                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                                  <h4 className="font-medium text-green-800 mb-2">🎫 ที่นั่งที่ได้รับ</h4>
                                  {customer.main_zone && (
                                    <p className="text-green-700">
                                      <span className="font-medium">โซน:</span> {customer.main_zone}
                                    </p>
                                  )}
                                  {customer.x && (
                                    <p className="text-green-700">
                                      <span className="font-medium">แถว:</span> {customer.x}
                                    </p>
                                  )}
                                  {customer.round && (
                                    <p className="text-green-700">
                                      <span className="font-medium">รอบ:</span> {customer.round}
                                    </p>
                                  )}
                                </div>
                              )}
                              
                              {/* Delivery Info */}
                              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <h4 className="font-medium text-blue-800 mb-2 flex items-center">
                                  <Package className="w-4 h-4 mr-1" />
                                  การจัดส่ง
                                </h4>
                                {getDeliveryStatus(customer)}
                                {customer.delivery_type === 'mail' && (
                                  <p className="text-blue-700 text-sm mt-2">
                                    หากต้องการหมายเลขพัสดุ กรุณาติดต่อเรา
                                  </p>
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                              <h4 className="font-medium text-yellow-800 mb-2">⏳ รอการจองบัตร</h4>
                              <p className="text-yellow-700 text-sm">
                                ข้อมูลที่นั่งจะแสดงหลังจากการจองสำเร็จ
                              </p>
                            </div>
                          )}

                          {/* Preferences */}
                          {(customer.main_zone || customer.backup_zone) && customer.status !== 'completed' && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-2">🎯 โซนที่ต้องการ</h4>
                              {customer.main_zone && (
                                <p className="text-sm text-gray-600">อันดับ 1: {customer.main_zone}</p>
                              )}
                              {customer.backup_zone && (
                                <p className="text-sm text-gray-600">อันดับ 2: {customer.backup_zone}</p>
                              )}
                            </div>
                          )}

                          {customer.notes && (
                            <div className="p-3 bg-gray-50 rounded-lg">
                              <h4 className="font-medium text-gray-700 mb-2">📝 หมายเหตุ</h4>
                              <p className="text-sm text-gray-600">{customer.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Contact Info */}
        <Card className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-2">📞 ต้องการความช่วยเหลือ?</h3>
              <p className="mb-4">หากมีข้อสงสัยหรือต้องการสอบถามเพิ่มเติม</p>
              <div className="flex justify-center space-x-8">
                <div>
                  <p className="font-semibold">โทรศัพท์</p>
                  <p className="text-blue-100">0xx-xxx-xxxx</p>
                </div>
                <div>
                  <p className="font-semibold">LINE ID</p>
                  <p className="text-blue-100">@wipeyeshop</p>
                </div>
                <div>
                  <p className="font-semibold">เวลาทำการ</p>
                  <p className="text-blue-100">9:00 - 18:00</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>❓ คำถามที่พบบ่อย</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-900">Q: เมื่อไหร่จะได้รับบัตร?</h4>
              <p className="text-sm text-gray-600">A: หลังจากการจองสำเร็จ เราจะแจ้งให้ทราบทันที และจัดส่งภายใน 1-2 วันทำการ</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Q: สามารถเปลี่ยนแปลงข้อมูลได้หรือไม่?</h4>
              <p className="text-sm text-gray-600">A: สามารถแก้ไขได้ก่อนที่เราจะดำเนินการจอง กรุณาติดต่อเราโดยด่วน</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Q: หากไม่ได้บัตรจะเป็นอย่างไร?</h4>
              <p className="text-sm text-gray-600">A: หากไม่สำเร็จจะไม่เก็บค่าบริการ และจะแจ้งผลให้ทราบทันที</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}