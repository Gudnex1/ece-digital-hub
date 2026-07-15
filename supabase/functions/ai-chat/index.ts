import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, useWebSearch = false } = await req.json();
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");

    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not configured");
    }

    // --- Ground the model in real, current department data ---
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");

    let deptContext = "";
    if (supabaseUrl && supabaseAnonKey) {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const [{ data: lecturers }, { data: researchAreas }] = await Promise.all([
        supabase
          .from("public_lecturers")
          .select("full_name, title, specialization, designation, office, bio")
          .limit(50),
        supabase
          .from("research_areas")
          .select("title, description, projects")
          .limit(50),
      ]);

      if (lecturers?.length) {
        deptContext +=
          "\n\nCurrent lecturers:\n" +
          lecturers
            .map(
              (l) =>
                `- ${l.full_name}${l.title ? `, ${l.title}` : ""}${l.designation ? ` (${l.designation})` : ""}${l.specialization ? ` — specializes in ${l.specialization}` : ""}`,
            )
            .join("\n");
      }
      if (researchAreas?.length) {
        deptContext +=
          "\n\nCurrent research areas:\n" +
          researchAreas.map((r) => `- ${r.title}: ${r.description}`).join("\n");
      }
    }

    const systemPrompt = `You are a helpful AI assistant for the Department of Electronic & Computer Engineering website.
You can answer questions about:
- The department's programs (BSc in Electronic Engineering, Computer Engineering, and integrated ECE)
- Research areas and facilities
- Infrastructure and laboratories
- Faculty members and staff
- General inquiries about the department

Be friendly, informative, and concise. Use the department information below as your source of truth for lecturers and research areas — never invent a name, title, or research topic that isn't listed there. If someone asks about a lecturer or topic not in this list, say you don't have that on record rather than guessing.
${deptContext || "\n\n(No live department data was available for this request.)"}
${useWebSearch ? "\nYou also have real-time Google Search access for this conversation. Use it for anything time-sensitive, external, or outside the department data above, and mention when your answer relies on a web search." : ""}`;

    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const geminiBody: Record<string, unknown> = {
      contents,
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    if (useWebSearch) {
      geminiBody.tools = [{ google_search: {} }];
    }

    // Non-streaming call — one complete JSON response, no SSE parsing to get wrong.
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiBody),
      },
    );

    const raw = await response.text();

    if (!response.ok) {
      console.error("Gemini API error:", response.status, raw);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "Rate limits exceeded, please try again later.",
          }),
          {
            status: 429,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      return new Response(
        JSON.stringify({ error: "AI gateway error", detail: raw }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let text = "";
    try {
      const parsed = JSON.parse(raw);
      text =
        parsed.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text ?? "")
          .join("") ?? "";
      if (!text) {
        console.error("Gemini returned no text. Full response:", raw);
      }
    } catch (e) {
      console.error("Failed to parse Gemini response:", raw);
      throw new Error("Could not parse AI response");
    }

    // Emit as a single SSE chunk in the same shape the frontend already expects,
    // so AIChatbot.tsx needs no changes even though this isn't token-by-token anymore.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        const openaiChunk = { choices: [{ delta: { content: text } }] };
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(openaiChunk)}\n\n`),
        );
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
