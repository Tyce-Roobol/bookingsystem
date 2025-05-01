import AdminLayout from "./AdminLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "FakeStraunt",
        template: "%s | Restock Things Dummy",
    },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminLayout>{children}</AdminLayout>
  )
}
