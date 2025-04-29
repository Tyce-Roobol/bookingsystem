import ClientLayout from "./ClientLayout"
import { Metadata } from "next";

export const metadata: Metadata = {
    title: {
        default: "FakeStraunt",
        template: "%s | Crappy Cheap Food",
    },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClientLayout>{children}</ClientLayout>
  )
}
