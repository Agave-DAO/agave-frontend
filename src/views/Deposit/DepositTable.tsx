import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTable, useSortBy, Column } from "react-table";
import BasicTable from "../../components/BasicTable";
import { IMarketData, marketData } from "../../utils/constants";

const DepositTable: React.FC<{ activeType: string }> = ({ activeType }) => {
  const history = useHistory();
  const data = useMemo(() => {
    if (activeType === "All") {
      return marketData;
    }

    return marketData.slice(0, 3);
  }, [activeType]);

  const columns: Column<IMarketData>[] = useMemo(
    () => [
      {
        Header: 'Asset',
        accessor: 'name',
        Cell: row => {
          return (
            <div>
              <img src={row.row.original.img} width="35" height="35" />
              <span>{row.value}</span>
            </div>
          )
        }
      },
      {
        Header: 'Your wallet balance',
        accessor: 'wallet_balance',
        Cell: row => (
            <span className="value">{row.value}</span>
        )
      },
      {
        Header: 'APY',
        accessor: 'deposit_apy',
        Cell: row => (
          <div className="value-section">
            <span className="value yellow">{row.value}</span> %
          </div>
        )
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable<IMarketData>(
    {
      columns,
      data: Array.from(data),
    },
    useSortBy
  );

  return (
    <BasicTable>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  <div className="header-column">
                    <span className={!column.isSorted ? '' : column.isSortedDesc ? 'desc' : 'asc'}>
                      {column.render('Header')}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, index) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()} onClick={() => history.push(`/deposit/${row.values.name}`)} key={index}>
                {row.cells.map(cell => {
                  return (
                    <td {...cell.getCellProps()}>
                      {cell.render('Cell')}
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    </BasicTable>
  )
}

export default DepositTable;
