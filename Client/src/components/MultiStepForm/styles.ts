import { media } from '@q-dev/q-ui-kit';
import styled from 'styled-components';

export const MultiStepFormContainer = styled.div<{ $step: number}>`
  display: grid;
  align-items: start;
  grid-template-columns: 1fr 320px;
  gap: 24px;
  margin-top: 16px;

  ${media.lessThan('xMedium')} {
    display: flex;
    flex-direction: column-reverse;
    gap: 8px;
    margin-top: 0;
  }

  .multi-step-form__step-content {
    margin-top: 24px;
  }

  .multi-step-form__step-tip {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

export const FormStepContainer = styled.form`
  .form-step-content {
    display: grid;
    gap: 16px;
    grid-template-columns: minmax(0, 1fr);
  }

  .form-step-actions {
    margin-top: 32px;
    display: flex;
    justify-content: space-between;
  }

  .form-step-action:last-child {
    margin-left: auto;
  }
`;
