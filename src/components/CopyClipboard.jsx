import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import CopyIcon from './Icons/CopyIcon';
import { Tooltip } from 'react-tooltip';
import { toast } from 'react-toastify';

const CopyClipboard = (props) => {
  const { data } = props;

  const onCopy = React.useCallback((data) => {
    toast.info(`Copy "${data}" To Clipboard!`);
  }, []);
  return (
    <>
      {data != '' ? (
        <>
          <CopyToClipboard onCopy={() => onCopy(data)} text={data}>
            <a
              id="copy-clipboard-tooltip"
              className="cursor-pointer padding-left-5"
              data-tooltip-content={`Copy "${data}" to clipboard`}
            >
              <CopyIcon />
            </a>
          </CopyToClipboard>
          <Tooltip
            anchorSelect="#copy-clipboard-tooltip"
            // place="right"
            type="success"
            effect="solid"
          />
        </>
      ) : (
        ''
      )}
    </>
  );
};

export default CopyClipboard;
