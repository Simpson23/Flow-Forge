import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Check user usage
    const { data: usage } = await supabase.from("user_usage").select("*").eq("user_id", userId).single()

    if (!usage) {
      // Create usage record for new user
      await supabase.from("user_usage").insert({ user_id: userId, generations_used: 0, is_pro: false })
    } else if (!usage.is_pro && usage.generations_used >= 3) {
      return NextResponse.json({ error: "Free tier limit reached. Please upgrade to Pro." }, { status: 403 })
    }

    // Generate workflow using OpenAI
    const systemPrompt = `You are an expert n8n workflow automation specialist. Generate a complete, valid n8n workflow JSON based on the user's description.

Requirements:
1. Create a valid n8n workflow JSON with proper structure
2. Include realistic node configurations with proper parameters
3. Use appropriate n8n node types (Gmail, Google Drive, HTTP Request, etc.)
4. Ensure proper connections between nodes
5. Include error handling where appropriate
6. Also generate a Mermaid diagram showing the workflow flow

Response format should be JSON with:
{
  "n8nJson": { ... complete n8n workflow ... },
  "mermaidDiagram": "graph TD; A[Start] --> B[Process] --> C[End]"
}

Make sure the n8n JSON includes:
- nodes array with proper node configurations
- connections array showing how nodes connect
- proper node IDs and types
- realistic parameters for each node type`

    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: systemPrompt,
      prompt: `Create an n8n workflow for: ${prompt}`,
    })

    let workflowData
    try {
      workflowData = JSON.parse(text)
    } catch (error) {
      return NextResponse.json({ error: "Failed to parse generated workflow" }, { status: 500 })
    }

    // Save workflow to database
    const { error: insertError } = await supabase.from("workflows").insert({
      user_id: userId,
      prompt,
      n8n_json: workflowData.n8nJson,
      mermaid_diagram: workflowData.mermaidDiagram,
    })

    if (insertError) {
      console.error("Failed to save workflow:", insertError)
    }

    // Update usage count
    if (!usage?.is_pro) {
      await supabase
        .from("user_usage")
        .update({
          generations_used: (usage?.generations_used || 0) + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
    }

    return NextResponse.json(workflowData)
  } catch (error) {
    console.error("Error generating workflow:", error)
    return NextResponse.json({ error: "Failed to generate workflow" }, { status: 500 })
  }
}
