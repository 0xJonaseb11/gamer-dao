import styled from 'styled-components';

export const StyledVoteForm = styled.form<{ $selectedOption: 'for' | 'against' }>`
  display: grid;
  gap: 24px;

  .q-ui-radio-group__option {
    align-items: center;
    grid-template: 'frame label';
    align-content: center;
    padding: 24px;
    
    &:first-child {
      border-color: ${({ theme, $selectedOption }) => $selectedOption === 'for'
        ? theme.colors.primaryMain
        : theme.colors.primaryMiddle
      };

      &:hover {
        border-color: ${({ theme }) => theme.colors.primaryMain};
      }

      .q-ui-radio__frame,
      .q-ui-radio__input:focus-visible ~ .q-ui-radio__frame {
        border-color: ${({ theme }) => theme.colors.primaryMain};

        .q-ui-radio__circle {
          background-color: ${({ theme }) => theme.colors.primaryMain};
        }
      }

      .q-ui-radio__input:focus-visible ~ .q-ui-radio__frame::after {
        outline: 1px solid ${({ theme }) => theme.colors.primaryLight};
      }

      .q-ui-radio__label {
        color: ${({ theme }) => theme.colors.primaryMain};
      }
    }

    &:last-child {
      border-color: ${({ theme, $selectedOption }) => $selectedOption === 'against'
        ? theme.colors.errorMain
        : theme.colors.errorPrimary
      };

      &:hover {
        border-color: ${({ theme }) => theme.colors.errorMain};
      }

      .q-ui-radio__frame,
      .q-ui-radio__input:focus-visible ~ .q-ui-radio__frame {
        border-color: ${({ theme }) => theme.colors.errorMain};

        .q-ui-radio__circle {
          background-color: ${({ theme }) => theme.colors.errorMain};
        }
      }

      .q-ui-radio__input:focus-visible ~ .q-ui-radio__frame::after {
        outline: 1px solid ${({ theme }) => theme.colors.errorSecondary};
      }

      .q-ui-radio__label {
        color: ${({ theme }) => theme.colors.errorMain};
      }
    }
  }
`;
