import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";
import { EditType } from "@/lib/types";

dotenv.config();
const API = process.env.INFERENCE_API_KEY;

const client = new HfInference(API);

const jsonSchema = {
  properties: {
    edit: {
      type: "string",
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

const formatPrompt = `Return the complete result in JSON format, in which 'edit' is the modified version of the text. Do not add any additional explanatory text.`;

const getJsonResponse = async (
  prompt: string,
  payload: string,
): Promise<ResponseType> => {
  const response = await client.chatCompletion({
    model: "meta-llama/Meta-Llama-3-8B-Instruct",
    messages: [
      {
        role: "system",
        content: prompt,
      },
      {
        role: "format_prompt",
        content: formatPrompt,
      },
      {
        role: "user",
        content: payload,
      },
    ],
    max_tokens: 500,
    response_format: {
      type: "json",
      value: JSON.stringify(jsonSchema),
    },
  });

  if (!response.choices[0].message.content) {
    return {
      success: false,
      error: "an error occurred during the generation of response",
    };
  }

  let jsonResponse;
  try {
    jsonResponse = JSON.parse(response.choices[0].message.content);
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
