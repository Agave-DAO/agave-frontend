import {
  Table,
  TableCellProps,
  TableProps,
  TableRowProps,
  TableColumnHeaderProps,
  Tbody,
  Td,
  Thead,
  Th,
  Tr,
} from "@chakra-ui/react";
import { TriangleDownIcon, TriangleUpIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";
import { Column, useTable, useSortBy, TableInstance } from "react-table";
import { useHistory } from "react-router-dom";

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
  linkpage?: string;
  table: TableRenderingInstance<TRecord>;
  tableProps?: TableProps;
  headProps?: TableColumnHeaderProps;
  rowProps?: TableRowProps;
  cellProps?: TableCellProps;
}

export const BasicTableRenderer: React.FC<BasicTableRendererProps<any>> = ({
  linkpage,
  table: { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow },
  tableProps: tableStyle,
  headProps: headStyle,
  rowProps: rowStyle,
  cellProps: cellStyle,
}) => {
  const reactHistory = useHistory();
  const handleRowClick = React.useCallback(
    (row: { original: { symbol: string } }) => {
      linkpage && reactHistory.push(`/${linkpage}/${row.original?.symbol}`);
    },
    []
  );
  return React.useMemo(
    () => (
      <Table {...getTableProps()}  {...tableStyle}>
        <Thead>
          {headerGroups.map(headerGroup => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <Th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  {...headStyle}
                >
                  {column.render("Header")}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <TriangleDownIcon ml={3} />
                      ) : (
                        <TriangleUpIcon ml={3} />
                      )
                    ) : null}
                  </span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr
                {...row.getRowProps()}
                {...rowStyle}
                onClick={() => handleRowClick(row)}
              >
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
      headStyle,
      rowStyle,
      cellStyle,
    ]
  );
};

export const MobileTableRenderer: React.FC<BasicTableRendererProps<any>> = ({
  linkpage,
  table: { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow },
  tableProps: tableStyle,
  headProps: headStyle,
  rowProps: rowStyle,
  cellProps: cellStyle,
}) => {
  const reactHistory = useHistory();
  const handleRowClick = React.useCallback(
    (row: { original: { symbol: string } }) => {
      linkpage && reactHistory.push(`/${linkpage}/${row.original?.symbol}`);
    },
    []
  );

  const headerGroup = headerGroups[0];

  return React.useMemo(
    () => (
      <Box as="table" {...tableStyle}>
        <Box as="tbody" {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <Box as="tr" {...row.getRowProps()} {...rowStyle}>
                {row.cells.map((cell, index) => {
                  const reactRow =
                    index !== 0 ? (
                      <Box {...cellStyle}>
                        <Box
                          as="td"
                          minWidth="50px"
                          {...headerGroup.getHeaderGroupProps()}
                        >
                          {headerGroup.headers[index].render("Header")}
                        </Box>
                        <Box as="td" {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        {...cellStyle}
                      >
                        <Box as="td" {...cell.getCellProps()}>
                          {cell.render("Cell")}
                        </Box>
                      </Box>
                    );

                  return reactRow;
                })}
              </Box>
            );
          })}
        </Box>
      </Box>
    ),
    [
      getTableProps,
      getTableBodyProps,
      headerGroups,
      rows,
      prepareRow,
      tableStyle,
      headStyle,
      rowStyle,
      cellStyle,
    ]
  );
};
