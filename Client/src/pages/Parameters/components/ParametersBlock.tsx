import { useTranslation } from 'react-i18next';

import { media, Spinner, Switch } from '@q-dev/q-ui-kit';
import styled from 'styled-components';
import { ParameterValue } from 'typings/parameters';

import EmptyListViewer from 'components/EmptyListViewer';

import ParametersTable from './ParametersTable';

export const StyledWrapper = styled.div`
  padding-top: 0;

  .parameters-block__title {
    padding: 24px 0 16px;
    display: flex;
    justify-content: space-between;
    
    ${media.lessThan('medium')} {
      flex-direction: column;
      gap: 16px;
    }
  }

  .parameters-block__loading-wrp {
    display: flex;
    justify-content: center;
    margin: 24px auto;
  }
`;

interface Props {
  title: string;
  parameters: ParameterValue[];
  loading: boolean;
  errorMsg: string;
  emptyMsg?: string;
  isSwitcherShown?: boolean;
  switcherValue?: boolean;
  switcherLabel?: string;
  onChange?: () => void;
}

function ParametersBlock ({
  title,
  switcherValue,
  isSwitcherShown,
  switcherLabel,
  parameters = [],
  loading = false,
  errorMsg = '',
  onChange
}: Props) {
  const { t } = useTranslation();

  return (
    <StyledWrapper className="block">
      <div className="text-h3 parameters-block__title">
        <h2>{title}</h2>
        {onChange && isSwitcherShown && switcherLabel &&
          <Switch
            label={switcherLabel}
            value={Boolean(switcherValue)}
            onChange={onChange}
          />}
      </div>

      {loading && !parameters.length
        ? (
          <div className="parameters-block__loading-wrp">
            <Spinner size={32} />
          </div>
        )
        : errorMsg || !parameters.length
          ? <EmptyListViewer message={errorMsg || t('NO_PARAMETERS')} />
          : <ParametersTable parameters={parameters} />
      }
    </StyledWrapper>
  );
}

export default ParametersBlock;
