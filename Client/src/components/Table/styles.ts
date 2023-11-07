import { media } from '@q-dev/q-ui-kit';
import styled, { css } from 'styled-components';

export const TableContainer = styled.div<{ tiny: boolean; withPagination: boolean }>`
  .react-bootstrap-table {
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
  }

  .head-elements {
    display: flex;
    justify-content: space-between;
    align-items: center;

    ${media.lessThan('tablet')} {
      flex-direction: column-reverse;
      align-items: flex-end;
      gap: 12px;
    }
  }

  .table {
    width: 100%;
    margin-bottom: 0;

    .table-bordered,
    .table-bordered td,
    .table-bordered th {
      border: none;
    }

    .table-header {
      margin-bottom: ${({ tiny }) => (tiny ? 0 : 24)}px;
    }

    .q-ui-search__container {
      width: 100%;
      max-width: 343px;
    }

    .react-bootstrap-table-pagination {
      > div:first-of-type {
        display: none;
      }
    }

    table {
      border-collapse: separate;
      border-spacing: 0 ${({ tiny }) => (tiny ? 0 : 4)}px;
    }

    thead th {
      &:first-child {
        padding-left: ${({ tiny }) => (tiny ? 0 : '32px')};
      }

      font-size: 14px;
      line-height: 17px;
      border-style: none;
      padding: ${({ tiny }) => (tiny ? '8px' : '16px 16px 8px')};
      color: ${({ theme }) => theme.colors.textPrimary};
      background: transparent;
      white-space: nowrap;
      vertical-align: bottom;

      &.sortable {
        cursor: pointer;
      }
    }

    tbody {
      tr {
        transition: all 0.2s ease-in-out;
        box-sizing: border-box;

        border-radius: 16px;

        font-weight: 600;
        font-size: 14px;
        line-height: 20px;
        color: ${({ theme }) => theme.colors.textPrimary};
        background: ${({ theme, tiny }) => tiny
          ? 'transparent'
          : theme.colors.naturalLight
        };
        margin-bottom: ${({ tiny }) => (tiny ? 0 : 10)}px;
        gap: 20px;
        height: ${({ tiny }) => (tiny ? 'auto' : 60)}px;

        ${({ tiny }) => !tiny && css`
          box-shadow: inset 0 0 1px 1px ${({ theme }) => theme.colors.borderPrimary};
        `}

        td {
          &:first-child {
            padding-left: ${({ tiny }) => (tiny ? 0 : '32px')};
          }
          vertical-align: middle;
          white-space: nowrap;
        }
      }
    }

    td {
      padding: ${({ tiny }) => (tiny ? 10 : 15)}px;

      ${({ tiny }) => tiny && css`
        border-top: 1px solid ${({ theme }) => theme.colors.borderSecondary} !important;
        border-radius: 0 !important;
      `}
    }

    td:first-child {
      border-top-left-radius: 16px;
      border-bottom-left-radius: 16px;
    }
    td:last-child {
      border-bottom-right-radius: 16px;
      border-top-right-radius: 16px;
    }

    .react-bootstrap-table-page-btns-ul {
      display: ${({ withPagination }) => (withPagination ? 'flex' : 'none')};
      justify-content: center;

      .page-item {
        margin-left: 4px;
        .page-link {
          display: flex;
          justify-content: center;
          align-items: center;
          width: ${({ tiny }) => tiny ? '32px' : '44px'};
          height: ${({ tiny }) => tiny ? '24px' : '40px'};
          padding: 0;
          border: none;
          border-radius: 4px;
          color: ${({ theme }) => theme.colors.textSecondary};
          background: transparent;

          &:hover {
            background: ${({ theme }) => theme.colors.tertiaryMain};
          }
        }
      }

      .active {
        border-radius: 4px;
        .page-link {
          color: ${({ theme }) => theme.colors.textPrimary};
          background: ${({ theme }) => theme.colors.tertiaryMiddle};

          &:focus {
            box-shadow: none;
            color: ${({ theme }) => theme.colors.textSecondary};
            background: ${({ theme }) => theme.colors.tertiaryMain};
            border: 2px solid ${({ theme }) => theme.colors.borderMain};
            border-radius: 4px;
          }

          &:hover {
            color: ${({ theme }) => theme.colors.textPrimary};
            background: ${({ theme }) => theme.colors.tertiaryMiddle};
          }
        }
      }
    }
  }
  .text-center {
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .table-pagination {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .pagination {
      margin-top: ${({ tiny }) => (tiny ? '8px' : '16px')};
      margin-bottom: 0;
      list-style: none;
    }
  }

`;

export const SortCaretIcon = styled.svg<{ $order?: string }>`
  width: 16px;
  height: 16px;
  display: inline-flex;

  path {
    &:first-child {
      fill: ${({ theme, $order }) =>
        $order === 'desc' ? theme.colors.secondaryMain : theme.colors.disableSecondary};
    }

    &:last-child {
      fill: ${({ theme, $order }) =>
        $order === 'asc' ? theme.colors.secondaryMain : theme.colors.disableSecondary};
    }
  }
`;
