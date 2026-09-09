export const formatVersionDescription = (description: string): string[] =>
  (description || '')
    .split(/\n|(?:\r?\n)|(?:- )/g)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line) => (line.endsWith('.') ? line : line + '.'));
