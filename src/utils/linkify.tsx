import type { ReactNode } from 'react';
const URL_SPLIT_PATTERN = /(https?:\/\/[^\s]+)/g;
const URL_TEST_PATTERN = /^https?:\/\//;
export const linkifyText = (text: string): ReactNode =>
  text.split(URL_SPLIT_PATTERN).map((part, index) =>
    URL_TEST_PATTERN.test(part) ? (
      <a key={index} href={part} target="_blank" rel="noopener noreferrer">
        {part}
      </a>
    ) : (
      part
    )
  );
