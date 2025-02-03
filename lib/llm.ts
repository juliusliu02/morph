import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import {
  grammarEditPrompt,
  lexicalEditPrompt,
  logicalEditPrompt,
} from "@/lib/prompts";
import type { Edit } from "@prisma/client";

const editSchema = {
  type: SchemaType.OBJECT,
  properties: {
    success: {
      type: SchemaType.BOOLEAN,
      description:
        "True if the original text is valid and the rewrite is successful, false otherwise.",
    },
    edit: {
      type: SchemaType.STRING,
      description:
        "The edited version of original text. Preserve line breaks as '\\n'",
      nullable: false,
    },
  },
  required: ["edit"],
};

export type ResponseType =
  | {
      success: true;
      response: string;
      error?: never;
    }
  | {
      success: false;
      response?: never;
      error: string;
    };

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY!);
const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash-exp",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: editSchema,
  },
});

const getJsonResponse = async (
  prompt: string,
  payload: string,
): Promise<ResponseType> => {
  let result;
  try {
    result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: prompt,
            },
            {
              text: payload,
            },
          ],
        },
      ],
    });
  } catch (error: unknown) {
    console.error(error);
    return {
      success: false,
      error: "Unable to generate content. Please try again later.",
    };
  }

  let jsonResponse;
  try {
    jsonResponse = JSON.parse(result.response.text());
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    } else {
      console.error(error);
      return {
        success: false,
        error: "Malformatted response.",
      };
    }
  }

  if (jsonResponse.success && jsonResponse.edit) {
    return {
      success: true,
      response: jsonResponse.edit,
    };
  } else
    return {
      success: false,
      error: "An error occurred while generating a response.",
    };
};

export const getEdit = async (
  type: Edit,
  original: string,
  customPrompt?: string,
): Promise<ResponseType> => {
  switch (type) {
    case "GRAMMAR":
      return await getJsonResponse(grammarEditPrompt, original);
    case "LEXICAL":
      return await getJsonResponse(lexicalEditPrompt, original);
    case "LOGICAL":
      return await getJsonResponse(logicalEditPrompt, original);
    case "CUSTOM":
      if (customPrompt) {
        return await getJsonResponse(customPrompt, original);
      } else {
        return { success: false, error: "Custom prompt cannot be empty." };
      }
    default:
      return { success: false, error: "Unknown edit type." };
  }
};
