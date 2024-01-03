import { useTranslation } from 'react-i18next';

import { Illustration } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const StyledWrapper = styled.div`
  padding: 24px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

interface Props {
  message?: string;
}

function EmptyListViewer ({ message = '' }: Props) {
  const { t } = useTranslation();

  return (
    <StyledWrapper>
      <Illustration type="empty-list" />
      <p className="text-lg font-semibold">
        {message || t('NO_DATA')}
      </p>
    </StyledWrapper>
  );
}

export default EmptyListViewer;
