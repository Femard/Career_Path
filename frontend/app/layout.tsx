import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Dynamic Career Pathing SaaS",
  description: "Navigate your career path with AI-powered trajectory planning",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
