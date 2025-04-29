export const metadata = {
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
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
