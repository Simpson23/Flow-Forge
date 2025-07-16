"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, Download, Eye, Copy, Sparkles } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { WorkflowPreview } from "@/components/workflow-preview"

interface WorkflowGeneratorProps {
  userId: string
}

interface GeneratedWorkflow {
  n8nJson: any
  mermaidDiagram: string
  prompt: string
}

export function WorkflowGenerator({ userId }: WorkflowGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedWorkflow, setGeneratedWorkflow] = useState<GeneratedWorkflow | null>(null)
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a workflow description",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/generate-workflow", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, userId }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to generate workflow")
      }

      const data = await response.json()
      setGeneratedWorkflow(data)
      setShowPreview(true)

      toast({
        title: "Success",
        description: "Workflow generated successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate workflow",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = () => {
    if (!generatedWorkflow) return

    const blob = new Blob([JSON.stringify(generatedWorkflow.n8nJson, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `workflow-${Date.now()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Downloaded",
      description: "Workflow JSON downloaded successfully",
    })
  }

  const handleCopy = async () => {
    if (!generatedWorkflow) return

    try {
      await navigator.clipboard.writeText(JSON.stringify(generatedWorkflow.n8nJson, null, 2))
      toast({
        title: "Copied",
        description: "Workflow JSON copied to clipboard",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            Generate Workflow
          </CardTitle>
          <CardDescription>
            Describe your automation workflow in plain English. Be specific about triggers, actions, and data flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Example: Create a workflow that monitors my Gmail for new emails with 'invoice' in the subject, extracts the attachment, and saves it to Google Drive in a folder called 'Invoices'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none"
          />

          <Button onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Workflow...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Workflow
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedWorkflow && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Generated Workflow</CardTitle>
                <CardDescription>Your n8n workflow is ready to use</CardDescription>
              </div>
              <Badge variant="secondary">Ready</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download JSON
              </Button>
              <Button onClick={handleCopy} variant="outline" size="sm">
                <Copy className="mr-2 h-4 w-4" />
                Copy JSON
              </Button>
              <Button onClick={() => setShowPreview(!showPreview)} variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                {showPreview ? "Hide" : "Show"} Preview
              </Button>
            </div>

            {showPreview && (
              <WorkflowPreview mermaidDiagram={generatedWorkflow.mermaidDiagram} n8nJson={generatedWorkflow.n8nJson} />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
