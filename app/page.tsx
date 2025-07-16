import { SignedIn, SignedOut } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Zap, Download, History, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const isClerkConfigured = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full">
              <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-6">FlowForge AI</h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
            Transform your automation ideas into ready-to-use n8n workflows. Simply describe what you want to automate
            in plain English, and our AI will generate the complete workflow JSON for you.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {isClerkConfigured ? (
              <>
                <SignedIn>
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </SignedIn>

                <SignedOut>
                  <Link href="/sign-up">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>

                  <Link href="/sign-in">
                    <Button variant="outline" size="lg">
                      Sign In
                    </Button>
                  </Link>
                </SignedOut>
              </>
            ) : (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  Demo mode - Authentication setup required for full functionality
                </p>
              </div>
            )}

            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View Pricing
              </Button>
            </Link>

            {!isClerkConfigured && (
              <Link href="/demo">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-200 text-blue-700 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-900/20 bg-transparent"
                >
                  Try Demo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card className="border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg w-fit">
                  <Sparkles className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>AI-Powered Generation</CardTitle>
                <CardDescription>
                  Describe your automation in natural language and get a complete n8n workflow
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg w-fit">
                  <Download className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>Ready to Use</CardTitle>
                <CardDescription>
                  Download the generated JSON and import directly into your n8n instance
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700">
              <CardHeader>
                <div className="bg-orange-100 dark:bg-orange-900/30 p-2 rounded-lg w-fit">
                  <History className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle>Workflow History</CardTitle>
                <CardDescription>Keep track of all your generated workflows and access them anytime</CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Example Section */}
          <div className="mt-16 text-left">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-6 text-center">How it works</h2>

            <Card className="max-w-2xl mx-auto border-slate-200 dark:border-slate-700">
              <CardHeader>
                <CardTitle className="text-lg">Example Prompt</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-4">
                  <p className="text-slate-700 dark:text-slate-300 italic">
                    "Create a workflow that monitors my Gmail for new emails with 'invoice' in the subject, extracts the
                    attachment, and saves it to Google Drive in a folder called 'Invoices'"
                  </p>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  FlowForge AI will generate a complete n8n workflow with Gmail trigger, email filtering, attachment
                  extraction, and Google Drive integration.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
