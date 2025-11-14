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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Users,
  Phone,
  MapPin,
  Package,
  Ticket,
  QrCode,
  Copy,
  User,
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
import toast from "react-hot-toast";

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
    seat_number: "",
    tracking_number: "",
    courier_service: "",
    delivery_date: "",
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
        const response = await fetch("/api/customers", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingCustomer.id, ...formData }),
        });

        console.log("Updating customer:", { id: editingCustomer.id, ...formData });
        
        if (response.ok) {
          toast.success("อัพเดทข้อมูลลูกค้าสำเร็จ");
        } else {
          toast.error("เกิดข้อผิดพลาดในการอัพเดท");
        }
      } else {
        // Create
        const response = await fetch("/api/customers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        
        if (response.ok) {
          toast.success("เพิ่มลูกค้าใหม่สำเร็จ");
        } else {
          toast.error("เกิดข้อผิดพลาดในการเพิ่มลูกค้า");
        }
      }

      setDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Failed to save customer:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบลูกค้านี้?")) return;

    try {
      const response = await fetch(`/api/customers?id=${id}`, { method: "DELETE" });
      if (response.ok) {
        toast.success("ลบลูกค้าสำเร็จ");
        fetchData();
      } else {
        toast.error("เกิดข้อผิดพลาดในการลบ");
      }
    } catch (error) {
      console.error("Failed to delete customer:", error);
      toast.error("เกิดข้อผิดพลาดในการลบ");
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
      seat_number: customer.seat_number || "",
      tracking_number: customer.tracking_number || "",
      courier_service: customer.courier_service || "",
      delivery_date: customer.delivery_date ? new Date(customer.delivery_date).toISOString().split('T')[0] : "",
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
      seat_number: "",
      tracking_number: "",
      courier_service: "",
      delivery_date: ""
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
      case "processing":
        return (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            กำลังจอง
          </Badge>
        );
      case "booked":
        return (
          <Badge variant="default" className="bg-purple-100 text-purple-800">
            จองสำเร็จ
          </Badge>
        );
      case "shipped":
        return (
          <Badge variant="default" className="bg-orange-100 text-orange-800">
            จัดส่งแล้ว
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            เสร็จสิ้น
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            ไม่สำเร็จ
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`คัดลอก${label}แล้ว`);
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
        .includes(searchTerm.toLowerCase()) ||
      (customer.tracking_number || "")
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
              จัดการข้อมูลลูกค้า การจองบัตร และข้อมูลการจัดส่ง
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
              <DialogContent className="max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
              <DialogHeader className="pb-6 border-b">
                <DialogTitle className="flex items-center gap-3 text-2xl">
                  {editingCustomer ? (
                    <>
                      <Edit2 className="w-6 h-6 text-blue-600" />
                      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        แก้ไขข้อมูลลูกค้า
                      </span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-6 h-6 text-green-600" />
                      <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                        เพิ่มลูกค้าใหม่
                      </span>
                    </>
                  )}
                </DialogTitle>
              </DialogHeader>
              
              <div className="overflow-y-auto overflow-x-hidden flex-1 px-1">
                <Tabs defaultValue="basic" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-4 h-14 bg-gray-50 rounded-xl p-1">
                    <TabsTrigger 
                      value="basic" 
                      className="flex items-center gap-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                    >
                      <User className="w-4 h-4" />
                      <span className="hidden sm:inline">ข้อมูลพื้นฐาน</span>
                      <span className="sm:hidden">พื้นฐาน</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="booking"
                      className="flex items-center gap-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                    >
                      <Ticket className="w-4 h-4" />
                      <span className="hidden sm:inline">การจอง</span>
                      <span className="sm:hidden">จอง</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="seat"
                      className="flex items-center gap-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="hidden sm:inline">ที่นั่ง/บัตร</span>
                      <span className="sm:hidden">ที่นั่ง</span>
                    </TabsTrigger>
                    <TabsTrigger 
                      value="delivery"
                      className="flex items-center gap-2 h-12 rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm transition-all"
                    >
                      <Package className="w-4 h-4" />
                      <span className="hidden sm:inline">การจัดส่ง</span>
                      <span className="sm:hidden">จัดส่ง</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tab 1: Basic Info */}
                    <TabsContent value="basic" className="space-y-6 mt-6">
                      {/* Header Card */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-lg text-gray-900">ข้อมูลพื้นฐาน</h3>
                            <p className="text-gray-600 text-sm">ข้อมูลหลักของลูกค้าและงานคอนเสิร์ต</p>
                          </div>
                        </div>
                      </div>

                      {/* Concert Selection */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="concert_id" className="text-base font-semibold text-gray-900 flex items-center gap-2">
                              🎵 งานคอนเสิร์ต
                              <span className="text-red-500">*</span>
                            </Label>
                            <Select
                              value={formData.concert_id}
                              onValueChange={(value) =>
                                setFormData({ ...formData, concert_id: value })
                              }
                            >
                              <SelectTrigger className="h-12 mt-2">
                                <SelectValue placeholder="🎭 เลือกงานคอนเสิร์ที่ต้องการ..." />
                              </SelectTrigger>
                              <SelectContent>
                                {concerts.map((concert) => (
                                  <SelectItem key={concert.id} value={concert.id} className="py-3">
                                    <div className="flex items-center gap-3">
                                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                      <span>{concert.title}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          👤 ข้อมูลลูกค้า
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              📱 หมายเลขโทรศัพท์
                              <span className="text-red-500">*</span>
                            </Label>
                            <Input
                              id="phone"
                              value={formData.phone}
                              onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                              }
                              placeholder="08xxxxxxxx"
                              className="mt-1.5 h-11"
                              required
                            />
                          </div>

                          <div>
                            <Label htmlFor="ticket_name" className="text-sm font-medium text-gray-700">
                              🎫 ชื่อบนบัตร
                            </Label>
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
                              className="mt-1.5 h-11"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Status & Price */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          ⚙️ การตั้งค่า
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                              🔄 สถานะ
                            </Label>
                            <Select
                              value={formData.status}
                              onValueChange={(value: CustomerStatus) =>
                                setFormData({ ...formData, status: value })
                              }
                            >
                              <SelectTrigger className="mt-1.5 h-11">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                    รอดำเนินการ
                                  </div>
                                </SelectItem>
                                <SelectItem value="processing">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    กำลังจอง
                                  </div>
                                </SelectItem>
                                <SelectItem value="booked">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    จองสำเร็จ
                                  </div>
                                </SelectItem>
                                <SelectItem value="shipped">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                                    จัดส่งแล้ว
                                  </div>
                                </SelectItem>
                                <SelectItem value="completed">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    เสร็จสิ้น
                                  </div>
                                </SelectItem>
                                <SelectItem value="failed">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                    ไม่สำเร็จ
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor="price" className="text-sm font-medium text-gray-700">
                              💰 ราคา (บาท)
                            </Label>
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
                              className="mt-1.5 h-11"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                          📝 หมายเหตุ
                        </Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) =>
                            setFormData({ ...formData, notes: e.target.value })
                          }
                          rows={4}
                          placeholder="หมายเหตุเพิ่มเติม..."
                          className="mt-1.5 resize-none"
                        />
                      </div>
                    </TabsContent>

                    {/* Tab 2: Booking Details */}
                    <TabsContent value="booking" className="space-y-6 mt-6">
                      {/* Header Card */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                            <Ticket className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-lg text-gray-900">ข้อมูลการจอง</h3>
                            <p className="text-gray-600 text-sm">รายละเอียดการจองบัตรและความต้องการ</p>
                          </div>
                        </div>
                      </div>

                      {/* Ticket Details */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          🎫 รายละเอียดบัตร
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <Label htmlFor="x" className="text-sm font-medium text-gray-700">
                              🐦 X (Twitter)
                            </Label>
                            <Input
                              id="x"
                              value={formData.x}
                              onChange={(e) =>
                                setFormData({ ...formData, x: e.target.value })
                              }
                              placeholder="@username"
                              className="mt-1.5 h-11"
                            />
                          </div>

                          <div>
                            <Label htmlFor="round" className="text-sm font-medium text-gray-700">
                              📅 รอบ
                            </Label>
                            <Input
                              id="round"
                              value={formData.round}
                              onChange={(e) =>
                                setFormData({ ...formData, round: e.target.value })
                              }
                              placeholder="เช่น Day 1, Day 2"
                              className="mt-1.5 h-11"
                            />
                          </div>

                          <div>
                            <Label htmlFor="ticket_count" className="text-sm font-medium text-gray-700">
                              🔢 จำนวนบัตร
                            </Label>
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
                              className="mt-1.5 h-11"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Zone Selection */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          🗺️ เลือกโซน
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="main_zone" className="text-sm font-medium text-gray-700">
                              🥇 โซนหลัก
                            </Label>
                            <Input
                              id="main_zone"
                              value={formData.main_zone}
                              onChange={(e) =>
                                setFormData({ ...formData, main_zone: e.target.value })
                              }
                              placeholder="โซนที่ต้องการเป็นอันดับ 1"
                              className="mt-1.5 h-11"
                            />
                          </div>

                          <div>
                            <Label htmlFor="backup_zone" className="text-sm font-medium text-gray-700">
                              🥈 โซนสำรอง
                            </Label>
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
                              className="mt-1.5 h-11"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Account Settings */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          👤 การตั้งค่าบัญชี
                        </h4>
                        <div className="space-y-6">
                          <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                            <Switch
                              checked={formData.use_customer_account}
                              onCheckedChange={(checked) =>
                                setFormData({
                                  ...formData,
                                  use_customer_account: checked,
                                })
                              }
                            />
                            <div>
                              <Label className="text-sm font-medium">ใช้บัญชีของลูกค้า</Label>
                              <p className="text-xs text-gray-500 mt-1">
                                เปิดใช้งานเมื่อลูกค้าต้องการใช้ username/password ของตนเอง
                              </p>
                            </div>
                          </div>

                          {formData.use_customer_account && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                              <div>
                                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                                  👤 Username
                                </Label>
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
                                  className="mt-1.5 h-11"
                                />
                              </div>

                              <div>
                                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                                  🔐 Password
                                </Label>
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
                                  className="mt-1.5 h-11"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Additional Services */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          🛠️ บริการเพิ่มเติม
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="kplus_number" className="text-sm font-medium text-gray-700">
                              📱 หมายเลข K Plus
                            </Label>
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
                              className="mt-1.5 h-11"
                            />
                          </div>

                          <div>
                            <Label htmlFor="delivery_type" className="text-sm font-medium text-gray-700">
                              📦 วิธีรับบัตร
                            </Label>
                            <Select
                              value={formData.delivery_type}
                              onValueChange={(value: DeliveryType) =>
                                setFormData({ ...formData, delivery_type: value })
                              }
                            >
                              <SelectTrigger className="mt-1.5 h-11">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pickup">
                                  <div className="flex items-center gap-2">
                                    <span>🏪</span>
                                    รับเอง
                                  </div>
                                </SelectItem>
                                <SelectItem value="mail">
                                  <div className="flex items-center gap-2">
                                    <span>📮</span>
                                    ส่งทางไปรษณีย์
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab 3: Seat & Ticket Info */}
                    <TabsContent value="seat" className="space-y-6 mt-6">
                      {/* Header Card */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                            <MapPin className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-lg text-gray-900">ข้อมูลที่นั่งและบัตร</h3>
                            <p className="text-gray-600 text-sm">กรอกข้อมูลหลังจากการจองสำเร็จแล้ว</p>
                          </div>
                        </div>
                      </div>

                      {/* Seat Information */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          🪑 ข้อมูลที่นั่ง
                        </h4>
                        <div className="grid grid-cols-1  gap-6">
                          <div>
                            <Label htmlFor="seat_number" className="text-sm font-medium text-gray-700">
                              🔢 หมายเลขที่นั่ง
                            </Label>
                            <Input
                              id="seat_number"
                              value={formData.seat_number}
                              onChange={(e) =>
                                setFormData({ ...formData, seat_number: e.target.value })
                              }
                              placeholder="เช่น 1, 2, 3 หรือ 1-4"
                              className="mt-1.5 h-11 w-full"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Tab 4: Delivery Info */}
                    <TabsContent value="delivery" className="space-y-6 mt-6">
                      {/* Header Card */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-6">
                        <div className="flex items-center mb-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <h3 className="font-bold text-lg text-gray-900">ข้อมูลการจัดส่ง</h3>
                            <p className="text-gray-600 text-sm">สำหรับลูกค้าที่เลือกวิธีรับบัตรผ่านไปรษณีย์</p>
                          </div>
                        </div>
                      </div>

                      {/* Shipping Information */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          🚚 ข้อมูลการส่ง
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <Label htmlFor="tracking_number" className="text-sm font-medium text-gray-700">
                              📦 หมายเลขพัสดุ
                            </Label>
                            <div className="flex gap-2 mt-1.5">
                              <Input
                                id="tracking_number"
                                value={formData.tracking_number}
                                onChange={(e) =>
                                  setFormData({ ...formData, tracking_number: e.target.value })
                                }
                                placeholder="หมายเลขติดตามพัสดุ"
                                className="h-11"
                              />
                              {formData.tracking_number && (
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => copyToClipboard(formData.tracking_number, 'หมายเลขพัสดุ')}
                                  className="h-11"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>

                          <div>
                            <Label htmlFor="courier_service" className="text-sm font-medium text-gray-700">
                              🚛 บริษัทขนส่ง
                            </Label>
                            <Select
                              value={formData.courier_service}
                              onValueChange={(value) =>
                                setFormData({ ...formData, courier_service: value })
                              }
                            >
                              <SelectTrigger className="mt-1.5 h-11 w-full">
                                <SelectValue placeholder="เลือกบริษัทขนส่ง" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Thailand Post">📮 ไปรษณีย์ไทย</SelectItem>
                                <SelectItem value="Kerry Express">🟡 Kerry Express</SelectItem>
                                <SelectItem value="J&T Express">🔴 J&T Express</SelectItem>
                                <SelectItem value="Flash Express">⚡ Flash Express</SelectItem>
                                <SelectItem value="Ninja Van">🥷 Ninja Van</SelectItem>
                                <SelectItem value="DHL">🟠 DHL</SelectItem>
                                <SelectItem value="FedEx">🟣 FedEx</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      {/* Delivery Dates */}
                      <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          📅 วันที่จัดส่ง
                        </h4>
                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            
                            <Input
                              id="delivery_date"
                              type="date"
                              value={formData.delivery_date}
                              onChange={(e) =>
                                setFormData({ ...formData, delivery_date: e.target.value })
                              }
                              className="mt-1.5 h-11"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    {/* Submit Buttons */}
                    <div className="flex justify-end space-x-3 pt-6 border-t bg-gray-50 -mx-6 px-6 pb-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDialogOpen(false)}
                        className="h-12 px-6"
                      >
                        ยกเลิก
                      </Button>
                      <Button type="submit" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        {editingCustomer ? "บันทึกการแก้ไข" : "เพิ่มลูกค้า"}
                      </Button>
                    </div>
                  </form>
                </Tabs>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
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
                <Ticket className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">จองสำเร็จ</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter((c) => c.status === "booked").length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">จัดส่งแล้ว</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {customers.filter((c) => c.status === "shipped").length}
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
                  <p className="text-sm font-medium text-gray-600">เสร็จสิ้น</p>
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
                    placeholder="ค้นหาโทรศัพท์, ชื่อ, งาน, พัสดุ..."
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
                    <SelectItem value="processing">กำลังจอง</SelectItem>
                    <SelectItem value="booked">จองสำเร็จ</SelectItem>
                    <SelectItem value="shipped">จัดส่งแล้ว</SelectItem>
                    <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                    <SelectItem value="failed">ไม่สำเร็จ</SelectItem>
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

                        {/* Seat Info */}
                        {( customer.seat_number) && (
                          <div className="mt-2 text-sm text-gray-600">
                            <span className="font-medium">ที่นั่ง:</span>{" "}
                            {[customer.seat_number]
                              .filter(Boolean)
                              .join(" - ")}
                          </div>
                        )}

                        {/* Tracking Info */}
                        {customer.tracking_number && (
                          <div className="mt-2 text-sm text-gray-600 flex items-center">
                            <span className="font-medium">พัสดุ:</span>{" "}
                            <span className="font-mono">{customer.tracking_number}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(customer.tracking_number!, 'หมายเลขพัสดุ')}
                              className="ml-2 h-6 w-6 p-0"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        )}

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