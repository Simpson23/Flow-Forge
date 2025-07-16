"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"

interface WorkflowPreviewProps {
  mermaidDiagram: string
  n8nJson: any
}

export function WorkflowPreview({ mermaidDiagram, n8nJson }: WorkflowPreviewProps) {
  const [activeTab, setActiveTab] = useState("diagram")

  return (
    <Card className="border-slate-200 dark:border-slate-700">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Workflow Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="diagram">Visual Diagram</TabsTrigger>
            <TabsTrigger value="json">JSON Code</TabsTrigger>
          </TabsList>

          <TabsContent value="diagram" className="mt-4">
            <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
              <div className="mb-4">
                <Badge variant="outline">Mermaid Diagram</Badge>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded border">
                <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{mermaidDiagram}</pre>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Copy this diagram code to visualize in Mermaid.js or compatible tools
              </p>
            </div>
          </TabsContent>

          <TabsContent value="json" className="mt-4">
            <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-800">
              <div className="mb-4 flex items-center justify-between">
                <Badge variant="outline">n8n JSON</Badge>
                <Badge variant="secondary">{n8nJson?.nodes?.length || 0} nodes</Badge>
              </div>
              <div className="bg-slate-900 dark:bg-slate-950 p-4 rounded border overflow-auto max-h-96">
                <pre className="text-sm text-green-400 font-mono">{JSON.stringify(n8nJson, null, 2)}</pre>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                Import this JSON directly into your n8n instance
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
