export type PassagePair = {
  original: string;
  edit: string;
};

export type Edit = {
  title?: string;
  original: string;
  grammarEdit: string;
  lexicalEdit: string;
  logicalEdit?: string;
  final?: string;
};

export type GrammarEdit = Pick<Edit, "title" | "original" | "grammarEdit">;

export type TopicQuestionEdit = Edit & {
  question: string;
};

// TODO: manage chart somehow (with storage?)
export type ChartQuestionEdit = {
  chart: string;
};
