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
import {
  Column,
  useTable,
  useSortBy,
  TableInstance,
  Row,
  RowPropGetter,
} from "react-table";
import { useHistory } from "react-router-dom";
import { useProtocolReserveConfiguration } from "../queries/protocolAssetConfiguration";

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

export interface RowRendererProps {
  row: Row<any>;
  rowStyle?: TableRowProps;
  cellStyle?: TableCellProps;
  handleRowClick?: any;
}

export const RowRenderer: React.FC<RowRendererProps> = ({
  row,
  rowStyle,
  handleRowClick,
  cellStyle,
}) => {
  // Get the token config, if the token is a Agave Interest Bearing Token, then send the reserve token address as a parameter, else send the token address
  const tokenConfig = useProtocolReserveConfiguration(
    row.original.backingReserve
      ? row.original.backingReserve.tokenAddress
      : row.original.tokenAddress
  );

  // If the token is frozen or inactive, then we return nothing
  if (!tokenConfig.data?.isActive || tokenConfig.data?.isFrozen) return <></>;

  return (
    <Tr
      {...row.getRowProps()}
      {...rowStyle}
      onClick={() => handleRowClick(row)}
    >
      {row.cells.map((cell: any) => {
        return (
          <Td {...cell.getCellProps()} {...cellStyle}>
            {cell.render("Cell")}
          </Td>
        );
      })}
    </Tr>
  );
};

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
    [linkpage, reactHistory]
  );
  return React.useMemo(
    () => (
      <Table {...getTableProps()} {...tableStyle}>
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
                    ) : (
                      <TriangleDownIcon ml={3} color="transparent" />
                    )}
                  </span>
                </Th>
              ))}
            </Tr>
          ))}
        </Thead>
        <Tbody {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <RowRenderer
                row={row}
                rowStyle={rowStyle}
                handleRowClick={handleRowClick}
                cellStyle={cellStyle}
              />
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
      handleRowClick,
    ]
  );
};

export const MobileTableRenderer: React.FC<BasicTableRendererProps<any>> = ({
  linkpage,
  table: { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow },
  tableProps: tableStyle,
  rowProps: rowStyle,
  cellProps: cellStyle,
}) => {
  const headerGroup = headerGroups[0];
  const reactHistory = useHistory();
  const handleRowClick = React.useCallback(
    (row: { original: { symbol: string } }) => {
      linkpage && reactHistory.push(`/${linkpage}/${row.original?.symbol}`);
    },
    [linkpage, reactHistory]
  );

  return React.useMemo(
    () => (
      <Box as="table" {...tableStyle}>
        <Box as="tbody" {...getTableBodyProps()}>
          {rows.map(row => {
            prepareRow(row);
            return (
              <Box
                as="tr"
                {...row.getRowProps()}
                {...rowStyle}
                onClick={() => handleRowClick(row)}
              >
                {row.cells.map((cell, index) => {
                  const reactRow =
                    index !== 0 ? (
                      <Box {...cellStyle} {...cell.getCellProps()} as="td">
                        <Box
                          minWidth="50px"
                          {...headerGroup.getHeaderGroupProps()}
                        >
                          {headerGroup.headers[index].render("Header")}
                        </Box>
                        <Box>{cell.render("Cell")}</Box>
                      </Box>
                    ) : (
                      <Box
                        as="td"
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        {...cellStyle}
                        {...cell.getCellProps()}
                      >
                        <Box>{cell.render("Cell")}</Box>
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
      getTableBodyProps,
      rows,
      prepareRow,
      tableStyle,
      rowStyle,
      cellStyle,
      headerGroup,
    ]
  );
};
