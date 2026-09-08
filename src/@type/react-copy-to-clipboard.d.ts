declare module 'react-copy-to-clipboard' {
  import { PureComponent, type ReactElement } from 'react';

  export interface CopyToClipboardProps {
    text: string;
    onCopy?: (text: string, result: boolean) => void;
    options?: {
      debug?: boolean;
      message?: string;
      format?: string;
    };
    children: ReactElement;
  }

  export class CopyToClipboard extends PureComponent<CopyToClipboardProps> {}
}
