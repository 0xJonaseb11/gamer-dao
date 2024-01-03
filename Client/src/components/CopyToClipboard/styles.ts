import styled from 'styled-components';

export const TooltipWrapper = styled.span`
  display: inline-flex;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.iconSecondary};


  .q-ui-tooltip__content {
    padding: 8px;
    box-shadow: inset 0 0 0 2px ${({ theme }) => theme.colors.blockShadow};
  }

  .copy-msg {
    min-width: 40px;
    max-width: 70px;
    display: flex;
    justify-content: center;
    white-space: nowrap;
  }
`;

export const CopyTrigger = styled.span`
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;

  i {
    font-size: 16px;
  }
`;
