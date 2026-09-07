export const pluralize = (word, count) => {
  return count > 1 ? (plural?.[word] ? plural[word] : word + "s") : word;
};

const plural = {
  policy: "policies",
};
