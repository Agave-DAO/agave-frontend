import React, { useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useTable, useSortBy, Column } from "react-table";
import BasicTable from "../../components/BasicTable";
import { IMarketDataTable, marketData } from "../../utils/constants";
import { SortedHtmlTable } from "../../utils/htmlTable";

const DTable: React.FC<{ activeType: string }> = ({ activeType }) => {
  const data = useMemo(() => {
    if (activeType === "All") {
      return( marketData?.map(
        ({ name, img, deposit_apy, wallet_balance }): IMarketDataTable => ({
          name,
          img,
          deposit_apy,
          wallet_balance,
        })
      ) ?? []
      );
    }

    return []
  }, [activeType]);

  
  const columns: Column<IMarketDataTable>[] = useMemo(
    () => [
      {
        Header: 'Asset',
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

    return (
      <div>
        <BasicTable>
          <SortedHtmlTable columns={columns} data={data} />
        </BasicTable>
      </div>
  );
}

const DepositTable: React.FC<{ activeType: string }> = ({ activeType }) => {
  const history = useHistory();
  const data = useMemo(() => {
    if (activeType === "All") {
      return marketData;
    }

    return marketData.slice(0, 3);
  }, [activeType]);

  const columns: Column<IMarketDataTable>[] = useMemo(
    () => [
      {
        Header: 'Asset',
        accessor: 'name',
        Cell: row => {
          return (
            <div>
              <img src={row.row.original.img} width="20" height="20" alt="" />
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
  
  const tableData = React.useMemo(
    () => ({
      columns: columns,
      data: Array.from(data),
    }),
    [columns, data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(tableData, useSortBy);

  return (
    <BasicTable>
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

export default DTable;
