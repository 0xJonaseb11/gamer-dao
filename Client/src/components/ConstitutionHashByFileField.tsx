import { ChangeEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { Icon, Tooltip } from '@q-dev/q-ui-kit';
import { ErrorHandler } from 'helpers';
import { sha256 } from 'js-sha256';
import styled from 'styled-components';

import Button from 'components/Button';

import { Bus } from 'utils';

interface Props {
  onChange: (event: string) => void;
  className?: string;
}

const InvertedIcon = styled(Icon)`
  transform: rotate(180deg);
`;

const CONSTITUTION_FILE_EXTENSIONS = '.adoc';

function ConstitutionHashByFileField ({ className, onChange }: Props) {
  const { t } = useTranslation();
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    hiddenFileInput.current?.click();
  };

  async function handleChange (event: ChangeEvent) {
    try {
      const uploadedTextFile = await (event.target as HTMLInputElement).files?.[0]?.text();
      const hash = uploadedTextFile
        ? `0x${sha256(uploadedTextFile)}`
        : '';
      onChange(hash);
      Bus.success(t('FILE_UPLOADED_SUCCESSFUL'));
    } catch (e) {
      ErrorHandler.process(e);
    }

    if (hiddenFileInput.current) {
      hiddenFileInput.current.value = '';
    }
  };

  return (
    <>
      <Tooltip
        trigger={(
          <Button
            icon
            compact
            look="ghost"
            className={className}
            onClick={handleClick}
          >
            <InvertedIcon name="download"/>
          </Button>
        )}
      >
        {t('UPLOAD_CONSTITUTION_TOOLTIP')}
      </Tooltip>

      <input
        ref={hiddenFileInput}
        type="file"
        accept={CONSTITUTION_FILE_EXTENSIONS}
        style={{ display: 'none' }}
        onChange={handleChange}
      />
    </>
  );
}

export default ConstitutionHashByFileField;
