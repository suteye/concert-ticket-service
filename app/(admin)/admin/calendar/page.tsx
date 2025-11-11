"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Concert } from "@/types";
import { format, isSameDay } from "date-fns";
import { th } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CalendarPage() {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [loading, setLoading] = useState(true);

  const fetchConcerts = async () => {
    try {
      const res = await fetch("/api/concerts");
      const data = await res.json();
      setConcerts(data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch concerts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchConcerts();
    };
    fetchData();
  }, []);

  const getConcertDates = (): Date[] => {
    return concerts.map((concert) => new Date(concert.event_date));
  };

  const getSelectedDateConcerts = (): Concert[] => {
    if (!selectedDate) return [];
    return concerts.filter((concert) =>
      isSameDay(new Date(concert.event_date), selectedDate)
    );
  };

  const modifiers = {
    booked: getConcertDates(),
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: "#3b82f6",
      color: "white",
      fontWeight: "bold",
    },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const selectedConcerts = getSelectedDateConcerts();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ปฏิทินงาน</h1>
          <p className="text-gray-600 mt-2">ดูงานคอนเสิร์ตทั้งหมดในปฏิทิน</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Calendar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  className="rounded-md border"
                  locale={th}
                />
              </div>
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-500">
                  วันที่มีงาน:{" "}
                  <span className="font-medium text-blue-600">
                    {concerts.length}
                  </span>{" "}
                  งาน
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Selected Date Events */}
          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  งานวันที่{" "}
                  {selectedDate
                    ? format(selectedDate, "PPP", { locale: th })
                    : "..."}
                </h2>

                {selectedConcerts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    ไม่มีงานในวันนี้
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedConcerts.map((concert) => (
                      <Card
                        key={concert.id}
                        className="border-2 border-blue-100"
                      >
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900">
                            {concert.title}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1">
                            เวลา:{" "}
                            {format(new Date(concert.event_date), "HH:mm น.")}
                          </p>
                          {concert.description && (
                            <p className="text-sm text-gray-600 mt-2">
                              {concert.description}
                            </p>
                          )}
                          <div className="mt-3 flex items-center space-x-2">
                            <Link
                              href={`/admin/concerts/${concert.id}/customers`}
                            >
                              <Button size="sm">ดูลูกค้า</Button>
                            </Link>
                            {concert.event_url && (
                              <a
                                href={concert.event_url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Button variant="outline" size="sm">
                                  ลิงก์งาน
                                </Button>
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* All Upcoming Events */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">งานทั้งหมด</h2>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {concerts.length === 0 ? (
                    <p className="text-center text-gray-500">ไม่มีงาน</p>
                  ) : (
                    concerts.map((concert) => (
                      <Link
                        key={concert.id}
                        href={`/admin/concerts/${concert.id}/customers`}
                      >
                        <div className="p-3 border rounded hover:bg-gray-50 transition cursor-pointer">
                          <p className="font-medium">{concert.title}</p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(concert.event_date), "PPP", {
                              locale: th,
                            })}
                          </p>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
