export type PassagePair = {
  original: string;
  edit: string;
};

export type Edit = {
  title?: string;
  original: string;
  grammarEdit: string;
  lexicalEdit: string;
  logicalEdit: string;
  final: string;
};
