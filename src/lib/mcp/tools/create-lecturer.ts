import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

declare const process: { env: Record<string, string | undefined> };

function sb(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "create_lecturer",
  title: "Create lecturer",
  description: "Add a lecturer profile. Admin only (enforced by RLS).",
  inputSchema: {
    full_name: z.string().min(1),
    email: z.string().email(),
    title: z.string().optional(),
    designation: z.string().optional(),
    specialization: z.string().optional(),
    qualifications: z.string().optional(),
    bio: z.string().optional(),
    phone: z.string().optional(),
    office: z.string().optional(),
    profile_image_url: z.string().url().optional(),
  },
  annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false },
  handler: async (input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const { data, error } = await sb(ctx)
      .from("lecturers")
      .insert({ ...input, user_id: ctx.getUserId() })
      .select()
      .single();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: JSON.stringify(data) }], structuredContent: { lecturer: data } };
  },
});