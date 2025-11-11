import { Navbar } from "@/components/admin/navbar";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Concert Ticket Service - ระบบจ้างกดบัตรคอนเสิร์ต",
  description: "ระบบบันทึกการจ้างกดบัตรคอนเสิร์ต",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
