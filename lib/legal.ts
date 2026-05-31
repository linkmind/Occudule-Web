import fs from "fs";
import path from "path";

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

export const LEGAL_FILES = {
  privacy: "privacy_policy_screen.md",
  terms: "terms_of_service_screen.md",
} as const;

export function getLegalMarkdown(filename: string): string {
  const filePath = path.join(LEGAL_DIR, filename);
  return fs.readFileSync(filePath, "utf-8");
}
