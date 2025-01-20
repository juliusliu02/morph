import { EditType } from "@/lib/types";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const geminiSchema = {
  type: SchemaType.OBJECT,
  properties: {
    edit: {
      type: SchemaType.STRING,
      description:
        "The edited version of original text. Line breaks are preserved as '\\n'",
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
    responseSchema: geminiSchema,
  },
});

const getJsonResponse = async (
  prompt: string,
  payload: string,
): Promise<ResponseType> => {
  const result = await model.generateContent({
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

  console.log(result.response.text());

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
        error: "malformatted response",
      };
    }
  }

  if (jsonResponse.edit) {
    return {
      success: true,
      response: jsonResponse.edit,
    };
  } else
    return {
      success: false,
      error: "generated response is malformatted",
    };
};

const grammarEditPrompt = `Correct only the grammatical mistakes in this text.`;

const lexicalEditPrompt = `Paraphrase or rephrase the content where it feels repetitive or unnatural.
  Try to maintain a sentence-to-sentence correspondence between the original and the edit.
  
  This is an essay specific written for the IELTS Academic writing.
  Changes made should should aim to showcase the learner's ability to paraphrase.
  While making modification, keep true to the learner's current linguistic capabilities.
  Aim for natural expressions; avoid using obscure and uncommon words.`;

const logicalEditPrompt = "";

export const getEdit = async (
  type: EditType,
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
      }
  }
  return { success: false, error: "unknown edit type" };
};
