import { Edit } from "@prisma/client";

export type PassagePair = {
  original: string;
  edit: string;
};

export type EditType = Edit;

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
