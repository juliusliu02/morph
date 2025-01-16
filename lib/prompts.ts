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
      response: string;
      error?: never;
    }
  | {
      response?: never;
      error: string;
    };

const formatPrompt =
  "Return the result in JSON format, in which 'edit' is the modified version of the text.";

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
      error: "an error occurred during the generation of response",
    };
  }

  let jsonResponse;
  try {
    jsonResponse = JSON.parse(response.choices[0].message.content);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        error: error.message,
      };
    } else {
      console.error(error);
      return {
        error: "malformatted response",
      };
    }
  }

  if (jsonResponse.edit) {
    return {
      response: jsonResponse.edit,
    };
  } else
    return {
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

export const getEdit = (
  type: EditType,
  original: string,
  customPrompt?: string,
) => {
  switch (type) {
    case "grammar":
      return getJsonResponse(grammarEditPrompt, original);
    case "lexical":
      return getJsonResponse(lexicalEditPrompt, original);
    case "logical":
      return getJsonResponse(logicalEditPrompt, original);
    case "custom":
      if (customPrompt) {
        return getJsonResponse(customPrompt, original);
      } else throw new Error("Unknown prompt type");
  }
};
