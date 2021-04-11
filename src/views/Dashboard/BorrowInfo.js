import React, { useState, useEffect, useMemo } from 'react';
import { withRouter } from 'react-router-dom';
import InfoTable from '../../components/InfoTable';
import CheckBox from '../../components/CheckBox';
import Button from '../../components/Button';
import { marketData } from '../../utils/constants';

function BorrowInfo({ history }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(marketData.slice(0, 2));
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: 'Your borrows',
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
        Header: 'Borrowed',
        accessor: 'wallet_balance',
        Cell: row => (
          <div className="value-col-section">
            <div className="value">{row.value} {row.row.original.name}</div>
            <div className="small">$ {row.value * row.row.original.asset_price}</div>
          </div>
        )
      },
      {
        Header: 'APR',
        accessor: 'variable_borrow_apr',
        Cell: row => (
          <div className="value-section">
            <span className="value blue">{row.value}</span> %
          </div>
        )
      },
      {
        Header: 'APR Type',
        accessor: 'isVariable',
        Cell: row => (
          <div className="value-section">
            <CheckBox isChecked={row.value} labels={['Variable', 'Stable']} handleChange={() => { history.push(`/interest-swap/${row.row.original.name}`)}} />
          </div>
        )
      },
      {
        Header: '',
        accessor: 'img',
        Cell: row => (
          <div className="value-section">
            <Button size="sm" variant="primary" onClick={() => history.push(`/borrow/${row.row.original.name}`)}>
              Borrow
            </Button>
            <Button size="sm" variant="outline" onClick={() => history.push(`/repay/${row.row.original.name}`)}>
              Repay
            </Button>
          </div>
        )
      },
    ],
    []
  );

  return (
    <InfoTable columns={columns} data={data} />
  )
}

export default withRouter(BorrowInfo);
