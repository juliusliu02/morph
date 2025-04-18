import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import {
  grammarEditPrompt,
  lexicalEditPrompt,
  logicalEditPrompt,
  systemPrompt,
} from "@/lib/llm/prompts";
import type { Edit } from "@prisma/client";
import { z } from "zod";

const editSchema = z.object({
  success: z
    .boolean()
    .describe(
      "True if the original text is valid and the rewrite is successful, false otherwise.",
    ),
  edit: z
    .string()
    .describe(
      "The edited version of original text. Preserve line breaks as \\n.",
    ),
  feedback: z
    .string()
    .describe(
      "Feedback on the original text and explanation for modifications in markdown.",
    ),
});

export type ResponseType =
  | {
      success: true;
      response: z.infer<typeof editSchema>;
      error?: never;
    }
  | {
      success: false;
      response?: never;
      error: string;
    };

const genAI = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_KEY,
});
const model = genAI("gemini-2.0-flash-exp");

const getResponse = async (
  prompt: string,
  payload: string,
): Promise<ResponseType> => {
  try {
    const { object } = await generateObject({
      model,
      schema: editSchema,
      system: systemPrompt.concat("\n\n", prompt),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: payload,
            },
          ],
        },
      ],
    });

    return {
      success: true,
      response: object,
    };
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error:
        "An error occurred while generating a response. Please try again later.",
    };
  }
};

export const getEdit = async (
  type: Edit,
  original: string,
  customPrompt?: string,
): Promise<ResponseType> => {
  switch (type) {
    case "GRAMMAR":
      return await getResponse(grammarEditPrompt, original);
    case "LEXICAL":
      return await getResponse(lexicalEditPrompt, original);
    case "LOGICAL":
      return await getResponse(logicalEditPrompt, original);
    case "CUSTOM":
      if (customPrompt) {
        return await getResponse(customPrompt, original);
      } else {
        return { success: false, error: "Custom prompt cannot be empty." };
      }
    default:
      return { success: false, error: "Unknown edit type." };
  }
};
