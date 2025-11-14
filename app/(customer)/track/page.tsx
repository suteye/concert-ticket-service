'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Search, Phone, Calendar, MapPin, Package, Clock, CheckCircle, 
  AlertCircle, Truck, QrCode, Ticket, User, Mail, Copy,
  ExternalLink, Star, Timer, Music, ArrowRight, Shield,
  Sparkles, HeartHandshake, MessageCircle
} from 'lucide-react'
import { Customer, CustomerWithConcert } from '@/types'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'
import toast from 'react-hot-toast'
import Image from 'next/image'

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

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`คัดลอก${label}แล้ว`)
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          badge: (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
              <Timer className="w-3 h-3 mr-1" />
              รอดำเนินการ
            </Badge>
          ),
          color: 'amber',
          emoji: '📋',
          title: 'รับการจอง',
          description: 'เราได้รับการจองของคุณแล้ว กำลังตรวจสอบข้อมูลและเตรียมการจอง',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-900',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600'
        }
      case 'processing':
        return {
          badge: (
            <Badge className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100">
              <Clock className="w-3 h-3 mr-1 animate-spin" />
              กำลังจอง
            </Badge>
          ),
          color: 'blue',
          emoji: '⚡',
          title: 'กำลังดำเนินการ',
          description: 'กำลังดำเนินการจองบัตรให้คุณ กรุณารอสักครู่',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-900',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        }
      case 'booked':
        return {
          badge: (
            <Badge className="bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100">
              <CheckCircle className="w-3 h-3 mr-1" />
              จองสำเร็จ
            </Badge>
          ),
          color: 'purple',
          emoji: '🎉',
          title: 'จองสำเร็จแล้ว!',
          description: 'ยินดีด้วย! จองบัตรสำเร็จแล้ว กำลังเตรียมจัดส่งบัตร',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-900',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-600'
        }
      case 'shipped':
        return {
          badge: (
            <Badge className="bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100">
              <Truck className="w-3 h-3 mr-1" />
              จัดส่งแล้ว
            </Badge>
          ),
          color: 'orange',
          emoji: '🚚',
          title: 'จัดส่งแล้ว',
          description: 'บัตรได้ถูกจัดส่งแล้ว กรุณาติดตามสถานะพัสดุ',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-900',
          iconBg: 'bg-orange-100',
          iconColor: 'text-orange-600'
        }
      case 'completed':
        return {
          badge: (
            <Badge className="bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
              <Star className="w-3 h-3 mr-1" />
              เสร็จสิ้น
            </Badge>
          ),
          color: 'green',
          emoji: '✨',
          title: 'เสร็จสิ้นแล้ว',
          description: 'การจองสำเร็จเรียบร้อย บัตรได้ส่งมอบแล้ว',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-900',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        }
      case 'failed':
        return {
          badge: (
            <Badge className="bg-red-50 text-red-700 border-red-200 hover:bg-red-100">
              <AlertCircle className="w-3 h-3 mr-1" />
              ไม่สำเร็จ
            </Badge>
          ),
          color: 'red',
          emoji: '❌',
          title: 'ไม่สำเร็จ',
          description: 'การจองไม่สำเร็จ จะไม่เก็บค่าบริการ',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-900',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600'
        }
      default:
        return {
          badge: <Badge variant="secondary">{status}</Badge>,
          color: 'gray',
          emoji: '❓',
          title: status,
          description: 'ข้อมูลสถานะ',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-900',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600'
        }
    }
  }

  const getProgressSteps = (status: string) => {
    const steps = [
      { key: 'pending', label: 'รับการจอง', icon: User },
      { key: 'processing', label: 'กำลังจอง', icon: Clock },
      { key: 'booked', label: 'จองสำเร็จ', icon: CheckCircle },
      { key: 'shipped', label: 'จัดส่ง', icon: Truck },
      { key: 'completed', label: 'เสร็จสิ้น', icon: Star }
    ]

    const statusOrder = ['pending', 'processing', 'booked', 'shipped', 'completed']
    const currentIndex = statusOrder.indexOf(status)

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Hero Header */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-lg opacity-30 animate-pulse"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
              <Search className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-6">
            ติดตามการจ้าง
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            🎫 ตรวจสอบสถานะการจ้าง ข้อมูลที่นั่ง และหมายเลขพัสดุ
            <br />
            <span className="text-lg text-gray-500">ได้ทุกที่ทุกเวลา</span>
          </p>
        </div>

        {/* Enhanced Search Card */}
        <div className="mb-12">
          <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl shadow-purple-500/20">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full text-purple-700 font-medium mb-4">
                  <Phone className="w-4 h-4" />
                  ค้นหาด้วยหมายเลขโทรศัพท์
                </div>
              </div>
              
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="h-6 w-6 text-gray-400" />
                  </div>
                  <Input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="กรอกหมายเลขโทรศัพท์ เช่น 0812345678"
                    className="pl-12 pr-32 h-16 text-lg border-gray-200 focus:border-purple-500 focus:ring-purple-500/20 rounded-2xl"
                    disabled={loading}
                  />
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="absolute right-2 top-2 h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-medium shadow-lg"
                    size="sm"
                  >
                    {loading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        ค้นหา...
                      </div>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        ค้นหา
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        {searched && (
          <div className="space-y-8">
            {customerData.length === 0 ? (
              <Card className="backdrop-blur-xl bg-white/80 border-0 shadow-2xl">
                <CardContent className="py-20 text-center">
                  <div className="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Search className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-800 mb-4">
                    ไม่พบข้อมูลการจ้าง
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
                    ไม่พบข้อมูลการจ้างกดบัตรด้วยหมายเลขโทรศัพท์นี้
                  </p>
                  <Button variant="outline" className="gap-2 rounded-xl">
                    <MessageCircle className="w-4 h-4" />
                    ติดต่อเรา
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-12">
                <div className="text-center">
                  <h2 className="text-4xl font-bold text-gray-900 mb-2">
                    🎉 พบข้อมูลการจ้าง
                  </h2>
                  <Badge variant="outline" className="text-lg px-4 py-2 bg-white/80">
                    {customerData.length} รายการ
                  </Badge>
                </div>
                
                {customerData.map((customer, index) => {
                  const statusInfo = getStatusInfo(customer.status)
                  
                  return (
                    <Card key={customer.id} className="overflow-hidden backdrop-blur-xl bg-white/90 border-0 shadow-2xl shadow-purple-500/10">
                      {/* Redesigned Header */}
                                          <div className="relative overflow-hidden">
                        {/* Main Header Background */}
                        <div className="h-64 relative">
                          {customer.concert?.image_url ? (
                            <>
                              <Image
                                src={customer.concert.image_url}
                                alt={customer.concert.title}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-105"
                                sizes="100vw"
                              />
                              {/* Enhanced Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-transparent to-black/80" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                              
                              {/* Decorative Elements */}
                              <div className="absolute top-0 left-0 w-full h-full">
                                <div className="absolute top-8 left-8 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                                <div className="absolute bottom-12 right-12 w-16 h-16 bg-purple-400/20 rounded-full blur-lg animate-pulse delay-1000"></div>
                              </div>
                            </>
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 relative overflow-hidden">
                              {/* Animated Background Pattern */}
                              <div className="absolute inset-0">
                                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                                  <div className="absolute top-8 left-8 w-24 h-24 bg-white/20 rounded-full animate-pulse"></div>
                                  <div className="absolute top-20 right-16 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-500"></div>
                                  <div className="absolute bottom-16 left-20 w-20 h-20 bg-white/15 rounded-full animate-pulse delay-1000"></div>
                                  <div className="absolute bottom-8 right-8 w-12 h-12 bg-white/25 rounded-full animate-pulse delay-300"></div>
                                </div>
                              </div>
                              <div className="absolute inset-0 bg-black/20" />
                            </div>
                          )}
                          
                          {/* Status Badge - Enhanced Design */}
                          <div className="absolute top-6 right-6 z-20">
                            <div className="relative">
                              <div className="absolute inset-0 bg-white/20 rounded-full blur-lg"></div>
                              <div className="relative">
                                {statusInfo.badge}
                              </div>
                            </div>
                          </div>
                          
                          {/* Concert Info Section - Completely Redesigned */}
                          <div className="absolute bottom-0 left-0 right-0 p-8">
                            <div className="flex items-end gap-6">
                              {/* Concert Thumbnail - Enhanced Design */}
                              <div className="relative group">
                                <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-lg opacity-60 group-hover:opacity-80 transition-all duration-300"></div>
                                <div className="relative w-20 h-20 rounded-2xl bg-white/95 backdrop-blur-sm border-2 border-white/70 flex items-center justify-center overflow-hidden shadow-2xl group-hover:shadow-purple-500/50 transition-all duration-300">
                                  {customer.concert?.image_url ? (
                                    <Image
                                      src={customer.concert.image_url}
                                      alt={customer.concert.title}
                                      width={80}
                                      height={80}
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                      <Music className="w-10 h-10 text-purple-600 group-hover:scale-110 transition-transform duration-300" />
                                    </div>
                                  )}
                                  
                                  {/* Hover Effect */}
                                  <div className="absolute inset-0 bg-gradient-to-t from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </div>
                                
                                {/* Concert Type Indicator */}
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                  <Star className="w-3 h-3 text-white" />
                                </div>
                              </div>
                              
                              {/* Concert Details */}
                              <div className="flex-1 min-w-0 space-y-3">
                                {/* Concert Title */}
                                <div className="space-y-2">
                                  <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 line-clamp-2 leading-tight">
                                    {customer.concert?.title}
                                  </h2>
                                  <div className="w-16 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                                </div>
                                
                                {/* Concert Info Tags */}
                                <div className="flex flex-wrap items-center gap-3">
                                  <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                    <Calendar className="w-4 h-4 text-white/90" />
                                    <span className="text-white/90 text-sm font-medium">
                                      {customer.concert && format(new Date(customer.concert.event_date), 'dd MMM yyyy', { locale: th })}
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 px-3 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                                    <Ticket className="w-4 h-4 text-white/90" />
                                    <span className="text-white/90 text-sm font-medium">
                                      {customer.ticket_count || 1} ใบ
                                    </span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-full border border-purple-300/30">
                                    <Shield className="w-4 h-4 text-white" />
                                    <span className="text-white text-xs font-mono font-bold tracking-wider">
                                      #{customer.id.slice(-8).toUpperCase()}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Bottom Decorative Line */}
                            <div className="mt-6 pt-4 border-t border-white/20">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <span className="text-white/70 text-xs">ระบบติดตามแบบเรียลไทม์</span>
                                </div>
                                
                                <div className="flex items-center gap-1">
                                  {[1,2,3,4,5].map((i) => (
                                    <div 
                                      key={i}
                                      className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" 
                                      style={{ animationDelay: `${i * 200}ms` }}
                                    ></div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      
                      <CardContent className="p-8">
                        {/* Status Alert */}
                        <div className={`${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-2xl p-6 mb-8`}>
                          <div className="flex items-start gap-4">
                            <div className={`${statusInfo.iconBg} w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0`}>
                              <span className="text-2xl">{statusInfo.emoji}</span>
                            </div>
                            <div className="flex-1">
                              <h3 className={`${statusInfo.textColor} font-bold text-xl mb-2`}>
                                {statusInfo.title}
                              </h3>
                              <p className={`${statusInfo.textColor} text-opacity-80`}>
                                {statusInfo.description}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Progress Timeline */}
                        <div className="mb-10">
                          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            ขั้นตอนการดำเนินการ
                          </h3>
                          
                          <div className="relative">
                            {/* Background Progress Line */}
                            <div className="absolute top-6 left-6 right-6 h-2 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 rounded-full"></div>
                            
                            {/* Animated Progress Lines between steps */}
                            <div className="absolute top-6 left-6 right-6 h-2 rounded-full overflow-hidden">
                              {getProgressSteps(customer.status).map((step, stepIndex) => {
                                if (stepIndex === getProgressSteps(customer.status).length - 1) return null;
                                
                                const nextStep = getProgressSteps(customer.status)[stepIndex + 1];
                                const segmentWidth = `calc((100% - 240px) / ${getProgressSteps(customer.status).length - 1})`;
                                const leftPosition = `calc(${stepIndex} * (100% - 240px) / ${getProgressSteps(customer.status).length - 1} + 24px)`;
                                
                                return (
                                  <div
                                    key={`line-${stepIndex}`}
                                    className={`absolute top-0 h-full transition-all duration-1000 ease-out ${
                                      step.completed && nextStep?.completed
                                        ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 shadow-sm'
                                        : step.completed && nextStep?.active
                                        ? 'bg-gradient-to-r from-purple-500 to-purple-300'
                                        : 'bg-gray-200'
                                    }`}
                                    style={{
                                      left: leftPosition,
                                      width: segmentWidth,
                                      animation: step.completed && nextStep?.completed ? 'shimmer 2s infinite' : 'none'
                                    }}
                                  />
                                );
                              })}
                            </div>
                            
                            <div className="flex justify-between relative">
                              {getProgressSteps(customer.status).map((step, stepIndex) => {
                                const getStepColors = (step: { key: string; completed: boolean; active: boolean }) => {
                                  if (step.completed) {
                                    switch (step.key) {
                                      case 'pending':
                                        return {
                                          bg: 'bg-gradient-to-br from-amber-400 to-amber-600',
                                          border: 'border-amber-500',
                                          text: 'text-amber-700',
                                          shadow: 'shadow-amber-500/40'
                                        };
                                      case 'processing':
                                        return {
                                          bg: 'bg-gradient-to-br from-blue-400 to-blue-600',
                                          border: 'border-blue-500',
                                          text: 'text-blue-700',
                                          shadow: 'shadow-blue-500/40'
                                        };
                                      case 'booked':
                                        return {
                                          bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
                                          border: 'border-purple-500',
                                          text: 'text-purple-700',
                                          shadow: 'shadow-purple-500/40'
                                        };
                                      case 'shipped':
                                        return {
                                          bg: 'bg-gradient-to-br from-orange-400 to-orange-600',
                                          border: 'border-orange-500',
                                          text: 'text-orange-700',
                                          shadow: 'shadow-orange-500/40'
                                        };
                                      case 'completed':
                                        return {
                                          bg: 'bg-gradient-to-br from-green-400 to-green-600',
                                          border: 'border-green-500',
                                          text: 'text-green-700',
                                          shadow: 'shadow-green-500/40'
                                        };
                                      default:
                                        return {
                                          bg: 'bg-gradient-to-br from-purple-400 to-purple-600',
                                          border: 'border-purple-500',
                                          text: 'text-purple-700',
                                          shadow: 'shadow-purple-500/40'
                                        };
                                    }
                                  } else if (step.active) {
                                    switch (step.key) {
                                      case 'pending':
                                        return {
                                          bg: 'bg-gradient-to-br from-amber-50 to-amber-100',
                                          border: 'border-amber-400',
                                          text: 'text-amber-600',
                                          shadow: 'shadow-amber-400/20'
                                        };
                                      case 'processing':
                                        return {
                                          bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
                                          border: 'border-blue-400',
                                          text: 'text-blue-600',
                                          shadow: 'shadow-blue-400/20'
                                        };
                                      case 'booked':
                                        return {
                                          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
                                          border: 'border-purple-400',
                                          text: 'text-purple-600',
                                          shadow: 'shadow-purple-400/20'
                                        };
                                      case 'shipped':
                                        return {
                                          bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
                                          border: 'border-orange-400',
                                          text: 'text-orange-600',
                                          shadow: 'shadow-orange-400/20'
                                        };
                                      case 'completed':
                                        return {
                                          bg: 'bg-gradient-to-br from-green-50 to-green-100',
                                          border: 'border-green-400',
                                          text: 'text-green-600',
                                          shadow: 'shadow-green-400/20'
                                        };
                                      default:
                                        return {
                                          bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
                                          border: 'border-purple-400',
                                          text: 'text-purple-600',
                                          shadow: 'shadow-purple-400/20'
                                        };
                                    }
                                  } else {
                                    return {
                                      bg: 'bg-white',
                                      border: 'border-gray-300',
                                      text: 'text-gray-400',
                                      shadow: ''
                                    };
                                  }
                                };

                                const colors = getStepColors(step);

                                return (
                                  <div key={step.key} className="flex flex-col items-center">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-700 relative z-10 ${
                                      step.completed 
                                        ? `${colors.bg} ${colors.border} text-white shadow-lg ${colors.shadow} transform hover:scale-110`
                                        : step.active
                                        ? `${colors.bg} ${colors.border} ${colors.text} animate-pulse shadow-lg ${colors.shadow} transform scale-110`
                                        : `${colors.bg} ${colors.border} ${colors.text}`
                                    }`}>
                                      <step.icon className={`w-5 h-5 transition-all duration-300 ${
                                        step.completed ? 'animate-bounce' : step.active ? 'animate-pulse' : ''
                                      }`} />
                                      
                                      {/* Completion Sparkle Effect */}
                                      {step.completed && (
                                        <div className="absolute inset-0 rounded-full">
                                          <div className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-ping"></div>
                                          <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-ping delay-100"></div>
                                        </div>
                                      )}
                                    </div>
                                    
                                    <span className={`text-sm mt-3 font-medium text-center transition-all duration-500 ${colors.text} ${
                                      step.active ? 'transform scale-110' : ''
                                    }`}>
                                      {step.label}
                                    </span>

                                    {/* Step Description */}
                                    {step.active && (
                                      <div className="mt-2 text-center">
                                        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                          step.key === 'pending' ? 'bg-amber-100 text-amber-700' :
                                          step.key === 'processing' ? 'bg-blue-100 text-blue-700' :
                                          step.key === 'booked' ? 'bg-purple-100 text-purple-700' :
                                          step.key === 'shipped' ? 'bg-orange-100 text-orange-700' :
                                          'bg-green-100 text-green-700'
                                        }`}>
                                          <div className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></div>
                                          {step.key === 'pending' ? 'กำลังตรวจสอบ' :
                                           step.key === 'processing' ? 'กำลังจองบัตร' :
                                           step.key === 'booked' ? 'เตรียมจัดส่ง' :
                                           step.key === 'shipped' ? 'อยู่ระหว่างทาง' :
                                           'เสร็จสิ้น'}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>

                        {/* Info Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          {/* Customer Info */}
                          <div className="space-y-6">
                            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                              <CardHeader className="pb-4">
                                <CardTitle className="flex items-center text-blue-900">
                                  <User className="w-5 h-5 mr-3" />
                                  ข้อมูลการจ้าง
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <span className="text-blue-700">โทรศัพท์:</span>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-blue-900">{customer.phone}</span>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => copyToClipboard(customer.phone, 'เบอร์โทร')}
                                      className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                                    >
                                      <Copy className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                
                                {customer.ticket_name && (
                                  <div className="flex justify-between">
                                    <span className="text-blue-700">ชื่อบนบัตร:</span>
                                    <span className="font-medium text-blue-900">{customer.ticket_name}</span>
                                  </div>
                                )}
                                
                                {customer.price && (
                                  <div className="flex justify-between">
                                    <span className="text-blue-700">ราคา:</span>
                                    <span className="font-bold text-green-600 text-lg">฿{customer.price.toLocaleString()}</span>
                                  </div>
                                )}
                                
                                <div className="flex justify-between">
                                  <span className="text-blue-700">วิธีรับบัตร:</span>
                                  <Badge variant="outline" className="bg-white/50">
                                    {customer.delivery_type === 'pickup' ? '🏪 รับเอง' : '📦 ส่งพัสดุ'}
                                  </Badge>
                                </div>
                              </CardContent>
                            </Card>

                            {/* Preferences */}
                            {(customer.main_zone || customer.backup_zone || customer.x) && (
                              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                                <CardHeader className="pb-4">
                                  <CardTitle className="flex items-center text-purple-900">
                                    <MapPin className="w-5 h-5 mr-3" />
                                    ข้อมูลที่ขอไว้
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  {customer.main_zone && (
                                    <div className="flex justify-between">
                                      <span className="text-purple-700">โซนที่ต้องการ:</span>
                                      <Badge className="bg-purple-100 text-purple-800">{customer.main_zone}</Badge>
                                    </div>
                                  )}
                                  {customer.backup_zone && (
                                    <div className="flex justify-between">
                                      <span className="text-purple-700">โซนสำรอง:</span>
                                      <Badge variant="outline" className="text-purple-700">{customer.backup_zone}</Badge>
                                    </div>
                                  )}
                                  {customer.x && (
                                    <div className="flex justify-between">
                                      <span className="text-purple-700">X (Twitter):</span>
                                      <span className="font-medium text-purple-900">{customer.x}</span>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </div>

                          {/* Ticket & Delivery Info */}
                          <div className="space-y-6">
                            {/* Seat Information */}
                            {(customer.status === 'booked' || customer.status === 'shipped' || customer.status === 'completed') ? (
                              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                                <CardHeader className="pb-4">
                                  <CardTitle className="flex items-center text-green-900">
                                    <Ticket className="w-5 h-5 mr-3" />
                                    🎫 ข้อมูลบัตร
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {customer.seat_number ? (
                                    <div className="space-y-4">
                                      <div className="bg-white/70 rounded-xl p-4 border border-green-200">
                                        <h4 className="font-bold text-green-800 mb-3">🪑 ที่นั่ง</h4>
                                        <div className="space-y-2">
                                         
                                          {customer.seat_number && (
                                            <div className="flex justify-between">
                                              <span className="text-green-700">หมายเลข:</span>
                                              <Badge className="bg-green-100 text-green-800">{customer.seat_number}</Badge>
                                            </div>
                                          )}
                                        </div>
                                      </div>                   
                                    </div>
                                  ) : (
                                    <div className="text-center py-8">
                                      <Clock className="w-12 h-12 text-green-600 mx-auto mb-4" />
                                      <p className="text-green-800 font-medium">กำลังเตรียมข้อมูลที่นั่ง</p>
                                      <p className="text-green-600 text-sm">ข้อมูลจะอัพเดทเร็วๆ นี้</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            ) : (
                              <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
                                <CardContent className="text-center py-8">
                                  <Timer className="w-12 h-12 text-amber-600 mx-auto mb-4" />
                                  <h3 className="font-bold text-amber-900 mb-2">⏳ รอการจองบัตร</h3>
                                  <p className="text-amber-800 text-sm">ข้อมูลที่นั่งจะแสดงหลังการจองเสร็จสิ้น</p>
                                </CardContent>
                              </Card>
                            )}

                            {/* Delivery Information */}
                            {customer.delivery_type === 'mail' && (
                              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                                <CardHeader className="pb-4">
                                  <CardTitle className="flex items-center text-orange-900">
                                    <Package className="w-5 h-5 mr-3" />
                                    📦 การจัดส่ง
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  {customer.tracking_number ? (
                                    <div className="space-y-4">
                                      <div className="bg-white/70 rounded-xl p-4 border border-orange-200">
                                        <div className="flex items-center justify-between mb-3">
                                          <div>
                                            <h4 className="font-bold text-orange-800 mb-1">📦 หมายเลขพัสดุ</h4>
                                            <p className="font-mono text-xl text-orange-900">{customer.tracking_number}</p>
                                          </div>
                                          <Button
                                            size="sm"
                                            onClick={() => copyToClipboard(customer.tracking_number!, 'หมายเลขพัสดุ')}
                                            className="bg-orange-100 text-orange-700 hover:bg-orange-200"
                                          >
                                            <Copy className="w-4 h-4 mr-1" />
                                            คัดลอก
                                          </Button>
                                        </div>
                                        
                                        {customer.courier_service && (
                                          <div className="flex justify-between">
                                            <span className="text-orange-700">ขนส่ง:</span>
                                            <Badge className="bg-orange-100 text-orange-800">{customer.courier_service}</Badge>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <Button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700">
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        ติดตามพัสดุ
                                      </Button>
                                    </div>
                                  ) : (
                                    <div className="text-center py-6">
                                      <Truck className="w-12 h-12 text-orange-600 mx-auto mb-4" />
                                      <p className="text-orange-800 font-medium">กำลังเตรียมการจัดส่ง</p>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </div>

                        {/* Notes */}
                        {customer.notes && (
                          <Card className="mt-8 bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
                            <CardHeader>
                              <CardTitle className="flex items-center text-gray-900">
                                <Mail className="w-5 h-5 mr-3" />
                                📝 หมายเหตุ
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <p className="text-gray-700">{customer.notes}</p>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Footer Section */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact */}
          <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 border-0 text-white shadow-2xl">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <HeartHandshake className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold mb-4">💬 ต้องการความช่วยเหลือ?</h3>
              <p className="text-white/80 mb-8">พร้อมให้บริการและแก้ไขปัญหาตลอด 24 ชั่วโมง</p>
              
              <div className="grid grid-cols-1 gap-4">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  แชทกับเรา
                </Button>
                <div className="text-center">
                  <p className="text-white/60 text-sm">⏰ พร้อมให้บริการตลอด 24 ชั่วโมง</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card className="backdrop-blur-xl bg-white/90 border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Shield className="w-6 h-6 text-blue-600" />
                ❓ คำถามที่พบบ่อย
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  q: "เมื่อไหร่จะได้รับบัตร?",
                  a: "หลังจองสำเร็จ จัดส่งภายใน 1-2 วันทำการ",
                  icon: "🎫"
                },
                {
                  q: "ติดตามพัสดุได้อย่างไร?",
                  a: "หมายเลขพัสดุจะแสดงที่นี่ คลิกเพื่อติดตาม",
                  icon: "📦"
                },
                {
                  q: "หากไม่ได้บัตรจะเป็นอย่างไร?",
                  a: "ไม่สำเร็จจะไม่เก็บค่าบริการ แจ้งผลทันที",
                  icon: "🛡️"
                }
              ].map((faq, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <span>{faq.icon}</span>
                    {faq.q}
                  </h4>
                  <p className="text-sm text-gray-600">{faq.a}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}