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
    const GROQ_API_KEY = Deno.env.get("GROQ_API_KEY");

    if (!GROQ_API_KEY) {
      throw new Error("GROQ_API_KEY is not configured");
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

    // NOTE: Groq's models are open-source (Llama, etc.) with no built-in
    // web search, unlike Gemini's google_search tool. If real-time web
    // grounding matters, that needs a separate search API call injected
    // as context here — this is where that would plug in.
    const systemPrompt = `You are a helpful AI assistant for the Department of Electronic & Computer Engineering website.
You can answer questions about:
- The department's programs (BSc in Electronic Engineering, Computer Engineering, and integrated ECE)
- Research areas and facilities
- Infrastructure and laboratories
- Faculty members and staff
- General inquiries about the department

Be friendly, informative, and concise. Use the department information below as your source of truth for lecturers and research areas — never invent a name, title, or research topic that isn't listed there. If someone asks about a lecturer or topic not in this list, say you don't have that on record rather than guessing.
${deptContext || "\n\n(No live department data was available for this request.)"}
${useWebSearch ? "\nNote: you do not currently have live web search access. If asked something that requires real-time information, say so honestly rather than guessing." : ""}`;

    // Groq is OpenAI-compatible, so this is the same request/response
    // shape the frontend already expects — true token streaming works.
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: systemPrompt }, ...messages],
          stream: true,
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", response.status, errorText);
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
        JSON.stringify({ error: "AI gateway error", detail: errorText }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Pass Groq's stream straight through — it's already in the exact
    // OpenAI SSE format the frontend parses, no translation needed.
    return new Response(response.body, {
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
