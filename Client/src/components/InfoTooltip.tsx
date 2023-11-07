import { Tooltip } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const InfoIcon = styled.i`
  font-size: 16px;
  line-height: 1;
  padding: 0 8px;
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: all 200ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

type TooltipProps = Parameters<typeof Tooltip>[0];
interface Props extends Omit<TooltipProps, 'trigger' | 'children'> {
  description: string;
}

function InfoTooltip ({ description, ...rest }: Props) {
  return (
    <Tooltip
      trigger={(
        <InfoIcon className="mdi mdi-information" />
      )}
      {...rest}
    >
      <span>{description}</span>
    </Tooltip>
  );
}

export default InfoTooltip;
