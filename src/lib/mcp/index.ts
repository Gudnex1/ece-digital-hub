import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listLecturers from "./tools/list-lecturers";
import createLecturer from "./tools/create-lecturer";
import listResearchAreas from "./tools/list-research-areas";
import createResearchArea from "./tools/create-research-area";
import whoami from "./tools/whoami";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "ece-digital-hub-mcp",
  title: "ECE Digital Hub MCP",
  version: "0.1.0",
  instructions:
    "Tools for the ECE Digital Hub: list and manage lecturer profiles and research areas. Write tools require admin role (enforced by row-level security).",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [whoami, listLecturers, createLecturer, listResearchAreas, createResearchArea],
});