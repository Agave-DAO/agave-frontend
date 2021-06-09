import {
  Table,
  TableCellProps,
  TableProps,
  TableRowProps,
  Tbody,
  Td,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { Column, useTable, useSortBy, TableInstance } from "react-table";

export type TableRenderingProps =
  | "getTableProps"
  | "getTableBodyProps"
  | "headerGroups"
  | "rows"
  | "prepareRow";
export type TableRenderingInstance<TRecord extends object> = Pick<
  TableInstance<TRecord>,
  TableRenderingProps
>;
export interface TableRenderer<TData extends object> {
  (tableInstance: TableRenderingInstance<TData>): React.ReactElement | null;
}

export function SortedHtmlTable<TRecord extends object>({
  columns,
  data,
  children,
}: {
  columns: Column<TRecord>[];
  data: TRecord[];
  children?: undefined | TableRenderer<TRecord>;
}) {
  const tableRenderer: TableRenderer<TRecord> = React.useMemo(
    () => children ?? (table => <BasicTableRenderer table={table} />),
    [children]
  );
  const memoColumns = React.useMemo(() => columns, [columns]);
  const memoData = React.useMemo(() => data, [data]);
  const tableInputs = React.useMemo(
    () => ({
      columns: memoColumns,
      data: memoData,
    }),
    [memoColumns, memoData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(tableInputs, useSortBy);

  // Create a new object because useTable isn't guaranteed
  // to alter identity of the passed object when it updates
  const tableInstance = React.useMemo(
    () => ({
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
    }),
    [getTableProps, getTableBodyProps, headerGroups, rows, prepareRow]
  );

  return React.useMemo(
    () => tableRenderer(tableInstance),
    [tableRenderer, tableInstance]
  );
}

export interface BasicTableRendererProps<TRecord extends object> {
  table: TableRenderingInstance<TRecord>;
  tableProps?: TableProps;
  rowProps?: TableRowProps;
  cellProps?: TableCellProps;
}

export const BasicTableRenderer: React.FC<BasicTableRendererProps<any>> = ({
  table: { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow },
  tableProps: tableStyle,
  rowProps: rowStyle,
  cellProps: cellStyle,
}) => {
  return React.useMemo(
    () => (
      <Table {...getTableProps()} margin={0} {...tableStyle}>
        <Thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (column.isSortedDesc ? " v" : " ^") : ""}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()} {...rowStyle}>
                {row.cells.map(cell => {
                  return (
                    <Td {...cell.getCellProps()} {...cellStyle}>
                      {cell.render("Cell")}
                    </Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    ),
    [
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      tableStyle,
      rowStyle,
      cellStyle,
    ]
  );
};