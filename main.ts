import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();
const API = process.env.INFERENCE_API_KEY;

const client = new HfInference(API);

// doc ref: https://huggingface.co/docs/text-generation-inference/main/en/basic_tutorials/using_guidance#grammar-and-constraints-
const jsonSchema = {
  properties: {
    text: {
      type: "string",
    },
  },
  required: ["body"],
};

const chatCompletion = await client.chatCompletion({
  model: "meta-llama/Meta-Llama-3-8B-Instruct",
  messages: [
    {
      role: "system",
      content: "Correct only the grammatical mistakes in this text.",
    },
    {
      role: "user",
      content:
        "The bar chart illustrates the percentage of men and women teachers in 6 different types of school setting in the UK in 2019. This six types of educational setting from nursery school to university lectures.  Male teacher are having the smallest percentage in the nursery school, the rate of men teachers approximately in 5% of it. Primary school’s men teachers still get similar percentage with the pre-school. In contrast, male teachers getting the largest amount in university lectures.   Female teachers have the highest rate in nursery and primary school compare to male teachers. In secondary school women teachers still have a larger quantity of male teachers, but male teachers are not far behind the female total number. The number with two gender have the same percentage in college. Women teachers getting lower in the next two stage of school.  Overall, women teachers percentage are decease when the school’s education level are rising. The rate of male teachers are different.",
    },
  ],
  max_tokens: 500,
  response_format: {
    type: "json",
    value: JSON.stringify(jsonSchema),
  },
});

const result = JSON.parse(chatCompletion.choices[0].message.content!);
console.log(result);

console.log(chatCompletion.choices[0].message);
