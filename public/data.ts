type LandingEdit = {
  type: string;
  text: string;
  footnote?: string;
};

export const LandingEdits: LandingEdit[] = [
  {
    type: "Sample text",
    text: "The research of artificial intelligence have been increased significantly in the last years, leading to many new discoveries. Scientist are trying to develop more advanced algorithms which can process datas more efficiently. However, there is still many challenges, including the ethic concerns and the lack of clear regulations. On the other hand, some experts argues that AI will replace humans in many profession, while others believe it will rather support peoples in their work. In conclusion, AI is an important topic that requires a careful considerations.",
  },
  {
    type: "Grammar edit",
    text:
      "Research into artificial intelligence has increased significantly in recent years, leading to many new discoveries. Scientists are trying to develop more advanced algorithms that can process data more efficiently.\n" +
      "\n" +
      "However, there are still many challenges, including ethical concerns and the lack of clear regulations. On the other hand, some experts argue that AI will replace humans in many professions, while others believe it will instead support people in their work. In conclusion, AI is an important topic that requires careful consideration.",
  },
  {
    type: "Lexical edit",
    text:
      "Artificial intelligence research has grown substantially in recent years, resulting in numerous new findings.\n" +
      "Researchers are working to create more sophisticated algorithms capable of processing data more effectively.\n" +
      "\n" +
      "However, significant challenges remain, including ethical considerations and the absence of well-defined regulations.\n" +
      "Some experts fear AI will supplant humans in many jobs, while others contend it will instead assist them.\n" +
      "In conclusion, AI is a crucial subject that merits thorough examination.",
  },
  {
    type: "Logical edit",
    text:
      "Artificial intelligence (AI) research has grown substantially in recent years, yielding numerous advancements.\n" +
      "Researchers are focused on developing sophisticated algorithms to enhance data processing efficiency.\n" +
      "\n" +
      "However, significant challenges persist, notably ethical considerations and the lack of clear regulations. Concerns exist regarding AI's potential to displace human workers, while others believe AI will primarily augment human capabilities.\n" +
      "\n" +
      "Therefore, a comprehensive and nuanced examination of AI's implications is essential.",
  },
  {
    type: "Custom edit",
    text:
      "The field of Artificial Intelligence (AI) research has experienced substantial growth, resulting in significant advancements.\n" +
      "Our research efforts are focused on developing sophisticated algorithms to enhance data processing efficiency.\n" +
      "\n" +
      "However, significant challenges persist, notably ethical considerations and the absence of clear regulatory frameworks. Concerns exist regarding AI's potential to displace human workers, while others believe AI will primarily augment human capabilities.\n" +
      "\n" +
      "Therefore, a comprehensive and nuanced examination of AI's implications is essential to maximize benefits and mitigate risks.",
    footnote: "Prompt: repurpose this for a business proposal.",
  },
] as const;
