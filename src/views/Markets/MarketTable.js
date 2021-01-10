import React from 'react';
import { Link } from 'react-router-dom'
import { useTable, useSortBy } from 'react-table'
import daiImg from '../../assets/image/coins/dai.svg';
import usdcImg from '../../assets/image/coins/usdc.svg';
import usdtImg from '../../assets/image/coins/usdt.svg';
import BasicTable from '../../components/BasicTable';

function MarketTable({activePrice}) {
  const data = React.useMemo(
    () => [
      {
        name: 'DAI',
        img: daiImg,
        market_size: 14300,
        total_borrowed: 2300,
        deposit_apy: 0.03,
        variable_borrow_apr: 0.43,
        stable_borrow_apr: 9.21
      },
      {
        name: 'USDC',
        img: usdcImg,
        market_size: 32000,
        total_borrowed: 4800,
        deposit_apy: 1.63,
        variable_borrow_apr: 2.27,
        stable_borrow_apr: 7.32
      },
      {
        name: 'USDT',
        img: usdtImg,
        market_size: 9800,
        total_borrowed: 3200,
        deposit_apy: 0.02,
        variable_borrow_apr: 0.04,
        stable_borrow_apr: 5.02
      },
      {
        name: 'DAI',
        img: daiImg,
        market_size: 14300,
        total_borrowed: 2300,
        deposit_apy: 0.03,
        variable_borrow_apr: 0.43,
        stable_borrow_apr: 9.21
      },
      {
        name: 'USDC',
        img: usdcImg,
        market_size: 32000,
        total_borrowed: 4800,
        deposit_apy: 1.63,
        variable_borrow_apr: 2.27,
        stable_borrow_apr: 7.32
      },
      {
        name: 'USDT',
        img: usdtImg,
        market_size: 9800,
        total_borrowed: 3200,
        deposit_apy: 0.02,
        variable_borrow_apr: 0.04,
        stable_borrow_apr: 5.02
      },
      {
        name: 'DAI',
        img: daiImg,
        market_size: 14300,
        total_borrowed: 2300,
        deposit_apy: 0.03,
        variable_borrow_apr: 0.43,
        stable_borrow_apr: 9.21
      },
      {
        name: 'USDC',
        img: usdcImg,
        market_size: 32000,
        total_borrowed: 4800,
        deposit_apy: 1.63,
        variable_borrow_apr: 2.27,
        stable_borrow_apr: 7.32
      },
      {
        name: 'USDT',
        img: usdtImg,
        market_size: 9800,
        total_borrowed: 3200,
        deposit_apy: 0.02,
        variable_borrow_apr: 0.04,
        stable_borrow_apr: 5.02
      },
    ],
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Assets',
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
        Header: 'Market Size',
        accessor: 'market_size',
        Cell: row => {
          return activePrice === 'usd' ? (
            <div className="value-section">
              $ <span className="value">{row.value}</span>
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
          return activePrice === 'usd' ? (
            <div className="value-section">
              $ <span className="value">{row.value}</span>
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
      data,
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
          {rows.map(row => {
            prepareRow(row)
            return (
              <Link to={`/reserve-overview/1`}>
                <tr {...row.getRowProps()}>
                  {row.cells.map(cell => {
                    return (
                      <td {...cell.getCellProps()}>
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              </Link>
            )
          })}
        </tbody>
      </table>
    </BasicTable>
  )
}

export default MarketTable;
