"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Users,
  Phone,
} from "lucide-react";
import {
  Customer,
  CustomerWithConcert,
  Concert,
  DeliveryType,
  CustomerStatus,
} from "@/types";
import { format } from "date-fns";
import { th } from "date-fns/locale";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<CustomerWithConcert[]>([]);
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [concertFilter, setConcertFilter] = useState<string>("all");

  const [formData, setFormData] = useState({
    concert_id: "",
    x: "",
    round: "",
    ticket_count: 1,
    main_zone: "",
    backup_zone: "",
    use_customer_account: false,
    username: "",
    password: "",
    kplus_number: "",
    delivery_type: "pickup" as DeliveryType,
    ticket_name: "",
    price: 0,
    phone: "",
    status: "pending" as CustomerStatus,
    notes: "",
  });

  const fetchData = async () => {
    try {
      // Fetch customers
      const customersRes = await fetch("/api/customers");
      const customersData = await customersRes.json();
      setCustomers(customersData);

      // Fetch concerts
      const concertsRes = await fetch("/api/concerts");
      const concertsData = await concertsRes.json();
      setConcerts(concertsData);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      await fetchData();
    };
    fetchInitialData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingCustomer) {
        // Update
        await fetch("/api/customers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCustomer.id, ...formData }),
        });
      } else {
        // Create
        await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Failed to save customer:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบลูกค้านี้?")) return;

    try {
      await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
      fetchData();
    } catch (error) {
      console.error("Failed to delete customer:", error);
    }
  };

  const openEditDialog = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      concert_id: customer.concert_id,
      x: customer.x || "",
      round: customer.round || "",
      ticket_count: customer.ticket_count || 1,
      main_zone: customer.main_zone || "",
      backup_zone: customer.backup_zone || "",
      use_customer_account: customer.use_customer_account,
      username: customer.username || "",
      password: customer.password || "",
      kplus_number: customer.kplus_number || "",
      delivery_type: customer.delivery_type || "pickup",
      ticket_name: customer.ticket_name || "",
      price: customer.price || 0,
      phone: customer.phone,
      status: customer.status,
      notes: customer.notes || "",
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      concert_id: "",
      x: "",
      round: "",
      ticket_count: 1,
      main_zone: "",
      backup_zone: "",
      use_customer_account: false,
      username: "",
      password: "",
      kplus_number: "",
      delivery_type: "pickup",
      ticket_name: "",
      price: 0,
      phone: "",
      status: "pending",
      notes: "",
    });
  };

  const getStatusBadge = (status: CustomerStatus) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="default" className="bg-yellow-100 text-yellow-800">
            รอดำเนินการ
          </Badge>
        );
      case "paid":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            ชำระแล้ว
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            สำเร็จ
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (customer.ticket_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (customer.concert?.title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || customer.status === statusFilter;
    const matchesConcert =
      concertFilter === "all" || customer.concert_id === concertFilter;

    return matchesSearch && matchesStatus && matchesConcert;
  });

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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">จัดการลูกค้า</h1>
            <p className="text-gray-600 mt-2">
              จัดการข้อมูลลูกค้าและการจองบัตรทั้งหมด
            </p>
          </div>
          <Dialog
            open={dialogOpen}
            onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มลูกค้าใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingCustomer ? "แก้ไขข้อมูลลูกค้า" : "เพิ่มลูกค้าใหม่"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Concert Selection */}
                <div className="space-y-2">
                  <Label htmlFor="concert_id">งานคอนเสิร์ต *</Label>
                  <Select
                    value={formData.concert_id}
                    onValueChange={(value) =>
                      setFormData({ ...formData, concert_id: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกงานคอนเสิร์ต" />
                    </SelectTrigger>
                    <SelectContent>
                      {concerts.map((concert) => (
                        <SelectItem key={concert.id} value={concert.id}>
                          {concert.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">หมายเลขโทรศัพท์ *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="08xxxxxxxx"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket_name">ชื่อบนบัตร</Label>
                    <Input
                      id="ticket_name"
                      value={formData.ticket_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ticket_name: e.target.value,
                        })
                      }
                      placeholder="ชื่อที่จะแสดงบนบัตร"
                    />
                  </div>
                </div>

                {/* Ticket Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="x">X (แถว)</Label>
                    <Input
                      id="x"
                      value={formData.x}
                      onChange={(e) =>
                        setFormData({ ...formData, x: e.target.value })
                      }
                      placeholder="เช่น A, B, C"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="round">รอบ</Label>
                    <Input
                      id="round"
                      value={formData.round}
                      onChange={(e) =>
                        setFormData({ ...formData, round: e.target.value })
                      }
                      placeholder="เช่น 1, 2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ticket_count">จำนวนบัตร</Label>
                    <Input
                      id="ticket_count"
                      type="number"
                      min="1"
                      value={formData.ticket_count}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          ticket_count: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                </div>

                {/* Zone Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="main_zone">โซนหลัก</Label>
                    <Input
                      id="main_zone"
                      value={formData.main_zone}
                      onChange={(e) =>
                        setFormData({ ...formData, main_zone: e.target.value })
                      }
                      placeholder="โซนที่ต้องการเป็นอันดับ 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup_zone">โซนสำรอง</Label>
                    <Input
                      id="backup_zone"
                      value={formData.backup_zone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          backup_zone: e.target.value,
                        })
                      }
                      placeholder="โซนสำรองกรณีโซนหลักเต็ม"
                    />
                  </div>
                </div>

                {/* Account Settings */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.use_customer_account}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          use_customer_account: checked,
                        })
                      }
                    />
                    <Label>ใช้ account ของลูกค้า</Label>
                  </div>

                  {formData.use_customer_account && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              username: e.target.value,
                            })
                          }
                          placeholder="username ของลูกค้า"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                          id="password"
                          type="password"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          placeholder="password ของลูกค้า"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Payment & Delivery */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="kplus_number">หมายเลข K Plus</Label>
                    <Input
                      id="kplus_number"
                      value={formData.kplus_number}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          kplus_number: e.target.value,
                        })
                      }
                      placeholder="หมายเลขสมาชิก K Plus"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="delivery_type">วิธีรับบัตร</Label>
                    <Select
                      value={formData.delivery_type}
                      onValueChange={(value: DeliveryType) =>
                        setFormData({ ...formData, delivery_type: value })
                      }
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
                    <Label htmlFor="price">ราคา (บาท)</Label>
                    <Input
                      id="price"
                      type="number"
                      min="0"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value) || 0,
                        })
                      }
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Status & Notes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">สถานะ</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: CustomerStatus) =>
                        setFormData({ ...formData, status: value })
                      }
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
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      rows={3}
                      placeholder="หมายเหตุเพิ่มเติม..."
                    />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    ยกเลิก
                  </Button>
                  <Button type="submit">
                    {editingCustomer ? "บันทึกการแก้ไข" : "เพิ่มลูกค้า"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    ลูกค้าทั้งหมด
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Phone className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">
                    รอดำเนินการ
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter((c) => c.status === "pending").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">฿</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">ชำระแล้ว</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter((c) => c.status === "paid").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">สำเร็จ</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter((c) => c.status === "completed").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>ค้นหา</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="ค้นหาโทรศัพท์, ชื่อ, งาน..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>สถานะ</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    <SelectItem value="pending">รอดำเนินการ</SelectItem>
                    <SelectItem value="paid">ชำระแล้ว</SelectItem>
                    <SelectItem value="completed">สำเร็จ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>งานคอนเสิร์ต</Label>
                <Select value={concertFilter} onValueChange={setConcertFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">ทั้งหมด</SelectItem>
                    {concerts.map((concert) => (
                      <SelectItem key={concert.id} value={concert.id}>
                        {concert.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                    setConcertFilter("all");
                  }}
                  className="w-full"
                >
                  รีเซ็ต
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers List */}
        <Card>
          <CardHeader>
            <CardTitle>รายการลูกค้า ({filteredCustomers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCustomers.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                ไม่พบข้อมูลลูกค้า
              </p>
            ) : (
              <div className="space-y-4">
                {filteredCustomers.map((customer) => (
                  <div
                    key={customer.id}
                    className="border rounded-lg p-4 hover:bg-gray-50"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {customer.ticket_name || customer.phone}
                          </h3>
                          {getStatusBadge(customer.status)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">งาน:</span>{" "}
                            {customer.concert?.title}
                          </div>
                          <div>
                            <span className="font-medium">โทรศัพท์:</span>{" "}
                            {customer.phone}
                          </div>
                          <div>
                            <span className="font-medium">จำนวน:</span>{" "}
                            {customer.ticket_count} ใบ
                          </div>
                          {customer.price && (
                            <div>
                              <span className="font-medium">ราคา:</span> ฿
                              {customer.price.toLocaleString()}
                            </div>
                          )}
                        </div>

                        {(customer.main_zone || customer.backup_zone) && (
                          <div className="mt-2 text-sm text-gray-600">
                            {customer.main_zone && (
                              <span className="mr-4">
                                <span className="font-medium">โซนหลัก:</span>{" "}
                                {customer.main_zone}
                              </span>
                            )}
                            {customer.backup_zone && (
                              <span>
                                <span className="font-medium">โซนสำรอง:</span>{" "}
                                {customer.backup_zone}
                              </span>
                            )}
                          </div>
                        )}

                        {customer.notes && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">หมายเหตุ:</span>{" "}
                            {customer.notes}
                          </div>
                        )}

                        <div className="mt-2 text-xs text-gray-500">
                          สร้างเมื่อ:{" "}
                          {format(new Date(customer.created_at), "PPPp", {
                            locale: th,
                          })}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(customer)}
                        >
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
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
