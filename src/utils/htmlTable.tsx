import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import React from "react";
import { Column, useTable, useSortBy } from "react-table";

export function SortedHtmlTable<TRecord extends object>({
  columns,
  data,
}: {
  columns: Column<TRecord>[];
  data: TRecord[];
}) {
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

  return React.useMemo(
    () => (
      <Table
        variant="striped"
        colorScheme="blackAlpha"
        {...getTableProps()}
        margin={0}
      >
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
              <Tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    ),
    [getTableProps, getTableBodyProps, headerGroups, rows, prepareRow]
  );
}
