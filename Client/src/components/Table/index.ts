import { CSSProperties } from 'react';
import { ColumnDescription } from 'react-bootstrap-table-next';

export { default } from './Table';

export interface TableColumn extends ColumnDescription {
  dataField: string;
  headerStyle?: CSSProperties | (() => CSSProperties);
  sortFunc?: (a: string, b: string, order: 'asc' | 'desc') => number;
}
