export type PassagePair = {
  original: string;
  edit: string;
};

export const EditOptions = ["grammar", "lexical", "logical", "custom"] as const;
export type EditType = (typeof EditOptions)[number];

export type Version = {
  hash: string;
  text: string;
  editType: EditType;
};

export type Dialogue = {
  title?: string;
  version: Version[];
};

export type TopicQuestionDialogue = Dialogue & {
  question: string;
};

// TODO: manage chart somehow (with storage?)
export type ChartQuestionDialogue = {
  chart: string;
};
