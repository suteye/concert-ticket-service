"use client";

import { useEffect, useState, useCallback } from "react";
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
import { Plus, Edit2, Trash2, Users, Upload, X } from "lucide-react";
import { Concert, ConcertStatus } from "@/types";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";
import Image from "next/image";

export default function ConcertsPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    event_url: "",
    description: "",
    service_fee: undefined as number | undefined,
    image_url: "",
    status: "upcoming" as ConcertStatus,
  });

  const fetchConcerts = useCallback(async () => {
    try {
      const res = await fetch("/api/concerts");
      const data = await res.json();
      setConcerts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch concerts:", error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const loadConcerts = async () => {
      await fetchConcerts();
    };
    loadConcerts();
  }, [fetchConcerts]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({ ...prev, image_url: data.url }));
      } else {
        alert('ไม่สามารถอัพโหลดรูปได้');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('เกิดข้อผิดพลาดในการอัพโหลด');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image_url: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingConcert) {
        // Update
        await fetch("/api/concerts", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingConcert.id, ...formData }),
        });
      } else {
        // Create
        await fetch("/api/concerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }

      setDialogOpen(false);
      resetForm();
      fetchConcerts();
    } catch (error) {
      console.error("Failed to save concert:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบงานนี้?")) return;

    try {
      await fetch(`/api/concerts?id=${id}`, { method: "DELETE" });
      fetchConcerts();
    } catch (error) {
      console.error("Failed to delete concert:", error);
    }
  };

  const openEditDialog = (concert: Concert) => {
    setEditingConcert(concert);
    setFormData({
      title: concert.title,
      event_date: format(new Date(concert.event_date), "yyyy-MM-dd'T'HH:mm"),
      event_url: concert.event_url || "",
      description: concert.description || "",
      image_url: concert.image_url || "",
      status: concert.status,
      service_fee: concert.service_fee,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingConcert(null);
    setFormData({
      title: "",
      event_date: "",
      event_url: "",
      description: "",
      service_fee: undefined,
      image_url: "",
      status: "upcoming",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              จัดการงานคอนเสิร์ต
            </h1>
            <p className="text-gray-600 mt-2">
              เพิ่ม แก้ไข และจัดการงานทั้งหมด
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
                เพิ่มงานใหม่
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingConcert ? "แก้ไขงาน" : "เพิ่มงานใหม่"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Image Upload Section */}
                <div className="space-y-2">
                  <Label>รูปภาพงาน</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {formData.image_url ? (
                      <div className="relative">
                        <Image
                          src={formData.image_url}
                          alt="Preview"
                          width={400}
                          height={200}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={handleRemoveImage}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 mb-2">อัพโหลดรูปภาพ</p>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                          className="max-w-xs mx-auto"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          รองรับ JPG, PNG (ขนาดไม่เกิน 5MB)
                        </p>
                      </div>
                    )}
                  </div>
                  {uploading && (
                    <p className="text-blue-600 text-sm">กำลังอัพโหลด...</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">ชื่องาน *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_date">วันที่และเวลากดบัตร *</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_url">ลิงก์งาน</Label>
                  <Input
                    id="event_url"
                    type="url"
                    value={formData.event_url}
                    onChange={(e) =>
                      setFormData({ ...formData, event_url: e.target.value })
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">รายละเอียดเพิ่มเติม</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service_fee">ค่าบริการ (บาท/ใบ)</Label>
                  <Input
                    id="service_fee"
                    type="number"
                    min="0"
                    value={formData.service_fee || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        service_fee: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    placeholder="เช่น 400"
                  />
                  <p className="text-xs text-gray-500">
                    ค่าบริการต่อใบบัตร (ถ้าไม่ระบุจะแสดงช่วงราคา 300-500)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">สถานะ</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: ConcertStatus) =>
                      setFormData({ ...formData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upcoming">กำลังจะมาถึง</SelectItem>
                      <SelectItem value="completed">เสร็จสิ้น</SelectItem>
                      <SelectItem value="cancelled">ยกเลิก</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setDialogOpen(false)}
                  >
                    ยกเลิก
                  </Button>
                  <Button type="submit" disabled={uploading}>
                    {editingConcert ? "บันทึกการแก้ไข" : "เพิ่มงาน"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        ) : concerts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500">ยังไม่มีงานคอนเสิร์ต</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {concerts.map((concert) => (
              <Card key={concert.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4 flex-1">
                      {/* Concert Image */}
                      {concert.image_url && (
                        <div className="flex-shrink-0">
                          <Image
                            src={concert.image_url}
                            alt={concert.title}
                            width={120}
                            height={80}
                            className="w-30 h-20 object-cover rounded-lg"
                          />
                        </div>
                      )}
                      
                      {/* Concert Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {concert.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {format(new Date(concert.event_date), "PPPp", {
                            locale: th,
                          })}
                        </p>
                        {concert.service_fee && (
                          <p className="text-sm font-medium text-green-600 mt-1">
                            ค่าบริการ: ฿{concert.service_fee.toLocaleString()}/ใบ
                          </p>
                        )}
                        {concert.description && (
                          <p className="text-gray-600 mt-2 text-sm">
                            {concert.description}
                          </p>
                        )}
                        {concert.event_url && (
                          <a
                            href={concert.event_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                          >
                            ดูลิงก์งาน →
                          </a>
                        )}
                        <div className="mt-3">
                          <span
                            className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                              concert.status === "upcoming"
                                ? "bg-green-100 text-green-800"
                                : concert.status === "completed"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {concert.status === "upcoming"
                              ? "กำลังจะมาถึง"
                              : concert.status === "completed"
                              ? "เสร็จสิ้น"
                              : "ยกเลิก"}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Link href={`/admin/concerts/${concert.id}/customers`}>
                        <Button variant="outline" size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          ลูกค้า
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(concert)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(concert.id)}
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
  );
}