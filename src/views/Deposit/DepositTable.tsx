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

export default DTable;
