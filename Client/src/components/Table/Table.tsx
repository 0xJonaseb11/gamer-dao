import { memo, ReactNode, useCallback, useState } from 'react';
import BootstrapTable, { ColumnSortCaret } from 'react-bootstrap-table-next';
import paginationFactory, { PaginationListStandalone, PaginationProvider } from 'react-bootstrap-table2-paginator';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { useTranslation } from 'react-i18next';

import { parseNumber } from '@q-dev/utils';

import Search from 'components/Search';

import { SkeletonTableLoading } from '../Base/SkeletonLoading/SkeletonLoading';

import { SortCaretIcon, TableContainer } from './styles';
import { TableColumn } from '.';

interface Props<T> {
  loading?: boolean;
  table: T[];
  error?: string | unknown;
  columns: TableColumn[];
  perPage?: number;
  emptyTableMessage: string;
  tiny?: boolean;
  header?: ReactNode;
  buttons?: ReactNode;
  hideSearch?: boolean;
  keyField?: string;
  searchFormatted?: boolean;
}

function Table<T> ({
  loading,
  table,
  error,
  buttons,
  columns,
  perPage = 1000,
  emptyTableMessage,
  header,
  tiny = false,
  keyField = 'id',
  hideSearch = false,
  searchFormatted = true
}: Props<T>) {
  const { t } = useTranslation();
  const [isEmpty, setIsEmpty] = useState(false);

  const afterSearch = useCallback((newTable: BootstrapTable[]) => {
    setIsEmpty(newTable.length === 0);
  }, []);

  const tableContent = () => {
    if (loading) {
      return <SkeletonTableLoading tiny={tiny} />;
    }
    if (!table.length) {
      return (
        <div className="text-center">
          <p className="text-xl">{emptyTableMessage}</p>
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center">
          <p className="text-xl ">Error, while loading table</p>
        </div>
      );
    }
    return (
      <PaginationProvider
        pagination={paginationFactory({
          page: 1,
          custom: true,
          sizePerPage: perPage,
          totalSize: table.length,
          nextPageTitle: 'Next page',
          prePageTitle: 'Pre page',
          firstPageTitle: 'First page',
          lastPageTitle: 'Last page',
        })}
      >
        {({ paginationProps, paginationTableProps }) => (
          <ToolkitProvider
            search={{ afterSearch, searchFormatted }}
            keyField={keyField}
            data={table}
            columns={columns.map((column) => ({
              sortFunc: (a, b, order) => order === 'desc'
                ? parseNumber(b) - parseNumber(a)
                : parseNumber(a) - parseNumber(b),
              ...column,
              sortCaret: ((order) => (
                <SortCaretIcon $order={order}>
                  <path d="M8.35351 12.1773C8.15825 12.3726 7.84167 12.3726 7.64641 12.1773L5.52018 10.0511C5.2052 9.73608 5.42828 9.19751 5.87373 9.19751H10.1262C10.5716 9.19751 10.7947 9.73608 10.4797 10.0511L8.35351 12.1773Z" />
                  <path d="M5.87373 6.79744C5.42828 6.79744 5.2052 6.25887 5.52018 5.94389L7.64641 3.81766C7.84167 3.6224 8.15825 3.6224 8.35351 3.81766L10.4797 5.94389C10.7947 6.25887 10.5716 6.79744 10.1262 6.79744H5.87373Z" />
                </SortCaretIcon>
              )) as ColumnSortCaret,
            }))}
          >
            {(props) => {
              // HACK:  https://github.com/react-bootstrap-table/react-bootstrap-table2/issues/1715
              if (props.searchProps.searchText.length >= 1) {
                paginationProps.page = 1;
                paginationProps.sizePerPage = 999;
              }
              return (
                <>
                  {!tiny && !hideSearch && (
                    <div className="head-elements">
                      <Search
                        alwaysEnabled
                        value={props.searchProps.searchText}
                        onChange={props.searchProps.onSearch}
                      />
                      {buttons}
                    </div>
                  )}

                  <BootstrapTable {...props.baseProps} {...paginationTableProps} />
                  {isEmpty
                    ? (
                      <div className="text-center">
                        <p className="text-xl">{t('NO_SUCH_RESULT')}</p>
                      </div>
                    )
                    : (
                      paginationProps.sizePerPage !== 999 && (
                        <div className="table-pagination">
                          <PaginationListStandalone {...paginationProps} />
                        </div>
                      )
                    )}
                </>
              );
            }}
          </ToolkitProvider>
        )}
      </PaginationProvider>
    );
  };

  return (
    <TableContainer withPagination={perPage < table.length} tiny={tiny}>
      <div className="table">
        {header && <div className="table-header">{header}</div>}
        {tableContent()}
      </div>
    </TableContainer>
  );
};

export default memo(Table);
