import fs from "fs";
import path from "path";

const PROMPT_DIR = path.join(process.cwd(), "lib", "llm", "prompts");
const getPath = (filename: string) => path.resolve(PROMPT_DIR, filename);

export const systemPrompt = fs.readFileSync(getPath("system.md"), "utf8");
export const grammarEditPrompt = fs.readFileSync(getPath("grammar.md"), "utf8");
export const lexicalEditPrompt = fs.readFileSync(getPath("lexical.md"), "utf8");
export const logicalEditPrompt = fs.readFileSync(getPath("logical.md"), "utf8");
