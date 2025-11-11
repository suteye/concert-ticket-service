'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react'
import { Concert, Customer, CustomerStatus, DeliveryType } from '@/types'
import Link from 'next/link'

export default function ConcertCustomersPage() {
  const params = useParams()
  const router = useRouter()
  const concertId = params.id as string

  const [concert, setConcert] = useState<Concert | null>(null)
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)
  const [formData, setFormData] = useState({
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
    price: 0,
    phone: '',
    status: 'pending' as CustomerStatus,
    notes: '',
  })


  useEffect(() => {
    const fetchData = async () => {
      try {
        // ดึงข้อมูลคอนเสิร์ต
        const concertRes = await fetch('/api/concerts')
        const allConcerts = await concertRes.json()
        const foundConcert = allConcerts.find((c: Concert) => c.id === concertId)
        setConcert(foundConcert)

        // ดึงข้อมูลลูกค้า
        const customersRes = await fetch(`/api/customers?concert_id=${concertId}`)
        const data = await customersRes.json()
        setCustomers(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [concertId])

  const fetchData = async () => {
    try {
      // ดึงข้อมูลคอนเสิร์ต
      const concertRes = await fetch('/api/concerts')
      const allConcerts = await concertRes.json()
      const foundConcert = allConcerts.find((c: Concert) => c.id === concertId)
      setConcert(foundConcert)

      // ดึงข้อมูลลูกค้า
      const customersRes = await fetch(`/api/customers?concert_id=${concertId}`)
      const data = await customersRes.json()
      setCustomers(data)
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch data:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const payload = {
        ...formData,
        concert_id: concertId,
      }

      if (editingCustomer) {
        await fetch('/api/customers', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingCustomer.id, ...payload }),
        })
      } else {
        await fetch('/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
      }

      setDialogOpen(false)
      resetForm()
      fetchData()
    } catch (error) {
      console.error('Failed to save customer:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบลูกค้านี้?')) return

    try {
      await fetch(`/api/customers?id=${id}`, { method: 'DELETE' })
      fetchData()
    } catch (error) {
      console.error('Failed to delete customer:', error)
    }
  }

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer)
    setFormData({
      x: customer.x || '',
      round: customer.round || '',
      ticket_count: customer.ticket_count || 1,
      main_zone: customer.main_zone || '',
      backup_zone: customer.backup_zone || '',
      use_customer_account: customer.use_customer_account,
      username: customer.username || '',
      password: customer.password || '',
      kplus_number: customer.kplus_number || '',
      delivery_type: customer.delivery_type || 'pickup',
      ticket_name: customer.ticket_name || '',
      price: customer.price || 0,
      phone: customer.phone,
      status: customer.status,
      notes: customer.notes || '',
    })
    setDialogOpen(true)
  }


  const resetForm = () => {
    setEditingCustomer(null)
    setFormData({
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
      price: 0,
      phone: '',
      status: 'pending' as CustomerStatus,
      notes: '',
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!concert) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="text-center">
          <p className="text-gray-500">ไม่พบงานนี้</p>
          <Link href="/admin/concerts">
            <Button className="mt-4">กลับไปหน้าจัดการงาน</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/admin/concerts">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            กลับ
          </Button>
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{concert.title}</h1>
            <p className="text-gray-600 mt-2">จัดการลูกค้าที่จ้างงานนี้</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open)
            if (!open) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มลูกค้า
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? 'แก้ไขข้อมูลลูกค้า' : 'เพิ่มลูกค้าใหม่'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="x">X (ตัวระบุงาน)</Label>
                    <Input
                      id="x"
                      value={formData.x}
                      onChange={(e) => setFormData({ ...formData, x: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="round">รอบการแสดง</Label>
                    <Input
                      id="round"
                      value={formData.round}
                      onChange={(e) => setFormData({ ...formData, round: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ticket_count">จำนวนบัตร</Label>
                    <Input
                      id="ticket_count"
                      type="number"
                      min="1"
                      value={formData.ticket_count}
                      onChange={(e) => setFormData({ ...formData, ticket_count: parseInt(e.target.value) })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">ค่ากดงานนี้ (บาท)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="main_zone">Zone หลัก</Label>
                    <Input
                      id="main_zone"
                      value={formData.main_zone}
                      onChange={(e) => setFormData({ ...formData, main_zone: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup_zone">Zone สำรอง</Label>
                    <Input
                      id="backup_zone"
                      value={formData.backup_zone}
                      onChange={(e) => setFormData({ ...formData, backup_zone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <Switch
                    checked={formData.use_customer_account}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, use_customer_account: checked })
                    }
                  />
                  <Label>ใช้ account ลูกค้าในการกดไหม?</Label>
                </div>

                {formData.use_customer_account && (
                  <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kplus_number">เบอร์โอน KPlus</Label>
                    <Input
                      id="kplus_number"
                      value={formData.kplus_number}
                      onChange={(e) => setFormData({ ...formData, kplus_number: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">เบอร์ติดต่อ *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                        <SelectItem value="pickup">รับเอง</SelectItem>
                        <SelectItem value="mail">ส่งทางไปรษณีย์</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket_name">ชื่อบนบัตร</Label>
                    <Input
                      id="ticket_name"
                      value={formData.ticket_name}
                      onChange={(e) => setFormData({ ...formData, ticket_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">สถานะ</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: CustomerStatus) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">รอดำเนินการ</SelectItem>
                      <SelectItem value="paid">ชำระแล้ว</SelectItem>
                      <SelectItem value="completed">สำเร็จ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">หมายเหตุ</Label>
                  <Input
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    ยกเลิก
                  </Button>
                  <Button type="submit">
                    {editingCustomer ? 'บันทึกการแก้ไข' : 'เพิ่มลูกค้า'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {customers.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">ยังไม่มีลูกค้าในงานนี้</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {customers.map((customer) => (
              <Card key={customer.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="grid grid-cols-3 gap-6 flex-1">
                      <div>
                        <p className="text-sm text-gray-500">ลูกค้า</p>
                        <p className="font-medium">{customer.phone}</p>
                        {customer.ticket_name && (
                          <p className="text-sm text-gray-600">{customer.ticket_name}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">โซน</p>
                        <p className="font-medium">{customer.main_zone || '-'}</p>
                        {customer.backup_zone && (
                          <p className="text-sm text-gray-600">สำรอง: {customer.backup_zone}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">จำนวนบัตร</p>
                        <p className="font-medium">{customer.ticket_count} ใบ</p>
                        <p className="text-sm text-gray-600">ค่ากด: {customer.price} บาท</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">สถานะ</p>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                            customer.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : customer.status === 'paid'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {customer.status === 'completed'
                            ? 'สำเร็จ'
                            : customer.status === 'paid'
                            ? 'ชำระแล้ว'
                            : 'รอดำเนินการ'}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">วิธีรับบัตร</p>
                        <p className="font-medium">
                          {customer.delivery_type === 'pickup' ? 'รับเอง' : 'ส่งทางไปรษณีย์'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(customer)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}