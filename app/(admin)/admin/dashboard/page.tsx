'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Users, CheckCircle, Clock, Plus, Eye } from 'lucide-react'
import { Concert, Customer, DashboardStats } from '@/types'
import Link from 'next/link'
import { format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalConcerts: 0,
    totalCustomers: 0,
    upcomingConcerts: 0,
    completedBookings: 0,
  })
  const [recentConcerts, setRecentConcerts] = useState<Concert[]>([])
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const fetchDashboardData = async () => {
    try {
      // Fetch concerts
      const concertsRes = await fetch('/api/concerts')
      const concerts: Concert[] = await concertsRes.json()

      // Fetch customers
      const customersRes = await fetch('/api/customers')
      const customers: Customer[] = await customersRes.json()

      // Calculate stats
      const upcomingConcerts = concerts.filter(c => c.status === 'upcoming').length
      const completedBookings = customers.filter(c => c.status === 'completed').length

      setStats({
        totalConcerts: concerts.length,
        totalCustomers: customers.length,
        upcomingConcerts,
        completedBookings,
      })

      // Set recent data (last 5 items)
      setRecentConcerts(concerts.slice(0, 5))
      setRecentCustomers(customers.slice(0, 5))

      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    // Defer invoking to avoid synchronous setState calls inside the effect
    Promise.resolve().then(() => {
      fetchDashboardData()
    })
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'upcoming':
        return <Badge variant="default" className="bg-green-100 text-green-800">กำลังจะมาถึง</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">เสร็จสิ้น</Badge>
      case 'cancelled':
        return <Badge variant="default" className="bg-gray-100 text-gray-800">ยกเลิก</Badge>
      case 'pending':
        return <Badge variant="default" className="bg-yellow-100 text-yellow-800">รอดำเนินการ</Badge>
      case 'paid':
        return <Badge variant="default" className="bg-blue-100 text-blue-800">ชำระแล้ว</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">แดชบอร์ด</h1>
            <p className="text-gray-600 mt-2">ภาพรวมระบบจัดการการจองบัตรคอนเสิร์ต</p>
          </div>
          <div className="flex space-x-3">
            <Link href="/admin/concerts">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มงานใหม่
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">งานทั้งหมด</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalConcerts}</div>
              <p className="text-xs text-muted-foreground">
                งานคอนเสิร์ตทั้งหมดในระบบ
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">ลูกค้าทั้งหมด</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCustomers}</div>
              <p className="text-xs text-muted-foreground">
                ลูกค้าที่ลงทะเบียนทั้งหมด
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">งานที่กำลังจะมาถึง</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.upcomingConcerts}</div>
              <p className="text-xs text-muted-foreground">
                งานที่ยังไม่เสร็จสิ้น
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">การจองที่สำเร็จ</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedBookings}</div>
              <p className="text-xs text-muted-foreground">
                การจองที่เสร็จสิ้นแล้ว
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Concerts */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>งานล่าสุด</CardTitle>
                <Link href="/admin/concerts">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    ดูทั้งหมด
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentConcerts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">ยังไม่มีงานคอนเสิร์ต</p>
              ) : (
                <div className="space-y-4">
                  {recentConcerts.map((concert) => (
                    <div key={concert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{concert.title}</h4>
                        <p className="text-sm text-gray-500">
                          {format(new Date(concert.event_date), 'PPP', { locale: th })}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(concert.status)}
                        <Link href={`/admin/concerts/${concert.id}/customers`}>
                          <Button variant="outline" size="sm">
                            จัดการ
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>ลูกค้าล่าสุด</CardTitle>
                <Link href="/admin/customers">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    ดูทั้งหมด
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentCustomers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">ยังไม่มีลูกค้า</p>
              ) : (
                <div className="space-y-4">
                  {recentCustomers.map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{customer.phone}</h4>
                        <p className="text-sm text-gray-500">
                          {customer.ticket_name || 'ไม่ระบุชื่อ'} • จำนวน {customer.ticket_count || 1} ใบ
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(customer.status)}
                        {customer.price && (
                          <span className="text-sm font-medium text-green-600">
                            ฿{customer.price.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>เมนูด่วน</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/admin/concerts">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <CalendarDays className="w-6 h-6 mb-2" />
                  จัดการงานคอนเสิร์ต
                </Button>
              </Link>
              <Link href="/admin/customers">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <Users className="w-6 h-6 mb-2" />
                  จัดการลูกค้า
                </Button>
              </Link>
              <Link href="/admin/settings">
                <Button variant="outline" className="w-full h-20 flex-col">
                  <CheckCircle className="w-6 h-6 mb-2" />
                  ตั้งค่าระบบ
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}