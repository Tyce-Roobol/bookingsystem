import { Metadata } from "next"
import AuthLayout from "./AuthLayout"

export const metadata: Metadata = {
  title: {
    default: "sign in/sign up",
    template: "%s | chop chop"
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthLayout>
      {children}
    </AuthLayout>
  )
}
