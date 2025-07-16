import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ClerkProvider } from "@clerk/nextjs"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FlowForge AI - AI-Powered n8n Workflow Generator",
  description: "Transform your automation ideas into ready-to-use n8n workflows with AI",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  if (!publishableKey) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
              <div className="max-w-md mx-auto text-center p-6">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Setup Required</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Please configure your Clerk publishable key to continue.
                </p>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg text-left">
                  <p className="text-sm font-mono text-slate-700 dark:text-slate-300">
                    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_key_here
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4">
                  Get your key at{" "}
                  <a
                    href="https://dashboard.clerk.com"
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    dashboard.clerk.com
                  </a>
                </p>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    )
  }

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Navbar />
            <main>{children}</main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
