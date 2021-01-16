import React, { useMemo } from 'react';
import { compose } from 'recompose';
import { withRouter } from 'react-router-dom'
import { useTable } from 'react-table'
import InfoTable from '../../components/InfoTable';
import CheckBox from '../../components/CheckBox';
import Button from '../../components/Button';
import { marketData } from '../../utils/constants';

function DepositInfo({ history }) {
  const data = useMemo(
    () => {
      return marketData.slice(0, 5);
    },
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Your deposits',
        accessor: 'name',
        Cell: row => {
          return (
            <div>
              <img src={row.row.original.img} alt="" width="35" height="35" />
              <span>{row.value}</span>
            </div>
          )
        }
      },
      {
        Header: 'Current balance',
        accessor: 'wallet_balance',
        Cell: row => (
          <div className="value-col-section">
            <div className="value">{row.value} {row.row.original.name}</div>
            <div className="small">$ {row.value * row.row.original.asset_price}</div>
          </div>
        )
      },
      {
        Header: 'APY',
        accessor: 'deposit_apy',
        Cell: row => (
          <div className="value-section">
            <span className="value blue">{row.value}</span> %
          </div>
        )
      },
      {
        Header: 'Collateral',
        accessor: 'collateral',
        Cell: row => (
          <div className="value-section">
            <CheckBox isChecked={row.value} handleChange={() => {}} />
          </div>
        )
      },
      {
        Header: '',
        accessor: 'img',
        Cell: row => (
          <div className="value-section">
            <Button size="sm" variant="primary" onClick={() => history.push(`/deposit/${row.row.original.name}`)}>
              Deposit
            </Button>
            <Button size="sm" variant="outline" onClick={() => history.push(`/withdraw/${row.row.original.name}`)}>
              Withdraw
            </Button>
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
  } = useTable(
    {
      columns,
      data,
    }
  );

  return (
    <InfoTable>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()}>
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
              <tr {...row.getRowProps()}>
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
    </InfoTable>
  )
}

export default compose(withRouter)(DepositInfo);
