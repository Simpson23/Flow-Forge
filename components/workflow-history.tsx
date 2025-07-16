"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { History, Download, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WorkflowHistoryProps {
  userId: string
}

interface WorkflowItem {
  id: string
  prompt: string
  n8nJson: any
  mermaidDiagram: string
  createdAt: string
}

export function WorkflowHistory({ userId }: WorkflowHistoryProps) {
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchHistory()
  }, [userId])

  const fetchHistory = async () => {
    try {
      const response = await fetch(`/api/workflows?userId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setWorkflows(data)
      }
    } catch (error) {
      console.error("Failed to fetch history:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = (workflow: WorkflowItem) => {
    const blob = new Blob([JSON.stringify(workflow.n8nJson, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `workflow-${workflow.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Workflow JSON downloaded successfully",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          History
        </CardTitle>
        <CardDescription>Your recent workflow generations</CardDescription>
      </CardHeader>
      <CardContent>
        {workflows.length === 0 ? (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400">No workflows generated yet</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {workflows.map((workflow) => (
              <div
                key={workflow.id}
                className="border border-slate-200 dark:border-slate-700 rounded-lg p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-white line-clamp-2">
                    {workflow.prompt.length > 60 ? `${workflow.prompt.substring(0, 60)}...` : workflow.prompt}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <Calendar className="h-3 w-3" />
                    {new Date(workflow.createdAt).toLocaleDateString()}
                  </div>

                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleDownload(workflow)} className="h-7 px-2">
                      <Download className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
