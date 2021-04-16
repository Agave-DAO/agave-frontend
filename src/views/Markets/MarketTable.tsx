import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom'
import { useTable, useSortBy, Column } from 'react-table'
import BasicTable from '../../components/BasicTable';
import { IMarketData, marketData } from '../../utils/constants';

export const MarketTable: React.FC<{ activePrice: "USD" | "Native" }> = ({ activePrice }) => {
  const history = useHistory();
  const data: IMarketData[] = useMemo(
    () => Array.from(marketData),
    []
  );

  const columns: Column<IMarketData>[] = useMemo(
    () => [
      {
        Header: 'Assets',
        accessor: 'name',
        Cell: row => {
          return (
            <div>
              <img src={row.row.original.img} width="35" height="35" alt="" />
              <span>{row.value}</span>
            </div>
          )
        }
      },
      {
        Header: 'Market Size',
        accessor: 'market_size',
        Cell: row => {
          return activePrice === 'USD' ? (
            <div className="value-section">
              $ <span className="value">{(row.value * row.row.original.asset_price).toFixed(2)}</span>
            </div>
          ) : (
            <span className="value">{row.value}</span>
          );
        }
      },
      {
        Header: 'Total Borrowed',
        accessor: 'total_borrowed',
        Cell: row => {
          return activePrice === 'USD' ? (
            <div className="value-section">
              $ <span className="value">{(row.value * row.row.original.asset_price).toFixed(2)}</span>
            </div>
          ) : (
            <span className="value">{row.value}</span>
          );
        }
      },
      {
        Header: 'Deposit APY',
        accessor: 'deposit_apy',
        Cell: row => (
          <div className="value-section">
            <span className="value yellow">{row.value}</span> %
          </div>
        )
      },
      {
        Header: 'Variable Borrow APR',
        accessor: 'variable_borrow_apr',
        Cell: row => (
          <div className="value-section">
            <span className="value blue">{row.value}</span> %
          </div>
        )
      },
      {
        Header: 'Stable Borrow APR',
        accessor: 'stable_borrow_apr',
        Cell: row => (
          <div className="value-section">
            <span className="value pink">{row.value}</span> %
          </div>
        )
      },
    ],
    [activePrice]
  );


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data: data,
    },
    useSortBy
  );

  return (
    <BasicTable>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} key={index}>
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
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} onClick={() => history.push(`/reserve-overview/${row.values.name}`)} key={index}>
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

export default MarketTable;
