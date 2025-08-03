import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { WorkflowGenerator } from "@/components/workflow-generator";
import { WorkflowHistory } from "@/components/workflow-history";
import { UsageTracker } from "@/components/usage-tracker";
import { TestCheckout } from "@/components/TestCheckout"; // 👈 Step 3: import added here

export default async function DashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Workflow Generator</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Describe your automation workflow in plain English and get a ready-to-use n8n JSON.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <WorkflowGenerator userId={userId} />
            <TestCheckout /> {/* 👈 Step 3: usage added here */}
          </div>

          <div className="space-y-6">
            <UsageTracker userId={userId} />
            <WorkflowHistory userId={userId} />
          </div>
        </div>
      </div>
    </div>
  );
}
