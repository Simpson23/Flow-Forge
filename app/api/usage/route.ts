import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let { data: usage } = await supabase.from("user_usage").select("*").eq("user_id", userId).single()

    if (!usage) {
      // Create usage record for new user
      const { data: newUsage } = await supabase
        .from("user_usage")
        .insert({ user_id: userId, generations_used: 0, is_pro: false })
        .select()
        .single()

      usage = newUsage
    }

    return NextResponse.json({
      generationsUsed: usage.generations_used,
      isPro: usage.is_pro,
      maxGenerations: 3,
    })
  } catch (error) {
    console.error("Error fetching usage:", error)
    return NextResponse.json({ error: "Failed to fetch usage" }, { status: 500 })
  }
}
