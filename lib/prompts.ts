import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();
const API = process.env.INFERENCE_API_KEY;

const client = new HfInference(API);

const grammarEditPrompt =
  "Correct only the grammatical mistake in this text. Return only the result; do not add sentences at the start.";

const lexicalEditPrompt =
  "Paraphrase or rephrase the content where it feels repetitive or unnatural.";

export const grammarEdit = async (content: string) => {
  return client.chatCompletion({
    model: "meta-llama/Meta-Llama-3-8B-Instruct",
    messages: [
      {
        role: "system",
        content: grammarEditPrompt,
      },
      {
        role: "user",
        content,
      },
    ],
    max_tokens: 500,
  });
};

export const lexicalEdit = async (content: string) => {
  return client.chatCompletion({
    model: "meta-llama/Meta-Llama-3-8B-Instruct",
    messages: [
      {
        role: "system",
        content: lexicalEditPrompt,
      },
      {
        role: "user",
        content,
      },
    ],
    max_tokens: 500,
  });
};
