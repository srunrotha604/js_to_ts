export const pluralize = (word: string, count: number): string => {
  return count > 1 ? (plural[word] ? plural[word] : word + 's') : word;
};

const plural: Record<string, string> = {
  policy: 'policies',
};
