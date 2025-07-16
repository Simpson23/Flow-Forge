"use client"

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Zap } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <nav className="border-b border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
            <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white">FlowForge AI</span>
        </Link>

        <div className="flex items-center space-x-4">
          {isClerkConfigured ? (
            <>
              <SignedIn>
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <Link href="/pricing">
                  <Button variant="ghost">Pricing</Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              <SignedOut>
                <Link href="/pricing">
                  <Button variant="ghost">Pricing</Button>
                </Link>
                <Link href="/sign-in">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button>Get Started</Button>
                </Link>
              </SignedOut>
            </>
          ) : (
            <>
              <Link href="/pricing">
                <Button variant="ghost">Pricing</Button>
              </Link>
              <Button variant="ghost" disabled>
                Demo Mode
              </Button>
            </>
          )}

          <ModeToggle />
        </div>
      </div>
    </nav>
  )
}
