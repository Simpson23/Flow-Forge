import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Get started with FlowForge AI</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Create your account and start generating workflows</p>
        </div>
        <SignUp
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-lg border border-slate-200 dark:border-slate-700",
            },
          }}
        />
      </div>
    </div>
  )
}
