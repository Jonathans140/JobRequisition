import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { RequisitionProvider } from "../context/requisition-context"
import { Toaster } from "../components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HT Manufactory - Job Requisition System",
  description: "Job requisition system for HT Manufactory",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <RequisitionProvider>
          {children}
          <Toaster />
        </RequisitionProvider>
      </body>
    </html>
  )
}

