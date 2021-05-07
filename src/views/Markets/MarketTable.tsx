import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { ErrorCode } from "@ethersproject/logger";
import React, { PropsWithChildren, useMemo } from "react";
import { useQuery } from "react-query";
import { useHistory } from "react-router-dom";
import { useTable, useSortBy, Column, CellProps } from "react-table";
import BasicTable from "../../components/BasicTable";
import {
  AgaveLendingABI,
  AgaveLendingABI__factory,
  Erc20abi__factory,
} from "../../contracts";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { imagesBySymbol } from "../../utils/constants";
import { internalAddresses } from "../../utils/contracts/contractAddresses/internalAddresses";
import { Web3Provider } from "@ethersproject/providers";

export type PromisedType<T> = T extends PromiseLike<infer P> ? P : never;

export interface UseMarketDataDto {
  address: string | null | undefined;
  library: Web3Provider | undefined;
  assets: ReadonlyArray<string>;
  reserves: Readonly<Record<string, ReserveData>>;
  assetInfo: Readonly<Record<string, AssetData>>;
  marketDataQueryKey: readonly [
    "marketData",
    string | undefined,
    Web3Provider | undefined,
    number | undefined
  ];
}

export interface AssetData {
  name: string;
  symbol: string;
  address: string;
}

export interface ReserveData {
  //stores the reserve configuration
  configuration: [BigNumber & ReserveConfigurationMap] & { data: BigNumber };
  //the liquidity index. Expressed in ray
  liquidityIndex: FixedNumber;
  //variable borrow index. Expressed in ray
  variableBorrowIndex: FixedNumber;
  //the current supply rate. Expressed in ray
  currentLiquidityRate: FixedNumber;
  //the current variable borrow rate. Expressed in ray
  currentVariableBorrowRate: FixedNumber;
  //the current stable borrow rate. Expressed in ray
  currentStableBorrowRate: FixedNumber;
  lastUpdateTimestamp: number;
  //tokens addresses
  aTokenAddress: string;
  stableDebtTokenAddress: string;
  variableDebtTokenAddress: string;
  //address of the interest rate strategy
  interestRateStrategyAddress: string;
  //the id of the reserve. Represents the position in the list of the active reserves
  id: number;
}

type Web3ReserveDataResult = PromisedType<
  ReturnType<typeof AgaveLendingABI.prototype.getReserveData>
>;

export function reserveDataFromWeb3Result({
  configuration,
  liquidityIndex,
  variableBorrowIndex,
  currentLiquidityRate,
  currentVariableBorrowRate,
  currentStableBorrowRate,
  lastUpdateTimestamp,
  aTokenAddress,
  stableDebtTokenAddress,
  variableDebtTokenAddress,
  interestRateStrategyAddress,
  id,
}: Web3ReserveDataResult): ReserveData {
  return {
    configuration,
    liquidityIndex: FixedNumber.fromValue(liquidityIndex, 27),
    variableBorrowIndex: FixedNumber.fromValue(variableBorrowIndex, 27),
    currentLiquidityRate: FixedNumber.fromValue(currentLiquidityRate, 27),
    currentVariableBorrowRate: FixedNumber.fromValue(
      currentVariableBorrowRate,
      27
    ),
    currentStableBorrowRate: FixedNumber.fromValue(currentStableBorrowRate, 27),
    lastUpdateTimestamp,
    aTokenAddress,
    stableDebtTokenAddress,
    variableDebtTokenAddress,
    interestRateStrategyAddress,
    id,
  };
}

//bit 0-15: LTV
//bit 16-31: Liq. threshold
//bit 32-47: Liq. bonus
//bit 48-55: Decimals
//bit 56: Reserve is active
//bit 57: reserve is frozen
//bit 58: borrowing is enabled
//bit 59: stable rate borrowing enabled
//bit 60-63: reserved
//bit 64-79: reserve factor
export interface ReserveConfigurationMap extends BigNumber {}

export const useMarketData = (): UseMarketDataDto => {
  const { account: address, library, chainId } = useAppWeb3();
  const marketDataQueryKey = useMemo(
    () =>
      [
        "marketData",
        address ?? undefined,
        library ?? undefined,
        chainId ?? undefined,
      ] as const,
    [address, library, chainId]
  );
  const { data } = useQuery(
    marketDataQueryKey,
    async (ctx) => {
      const [
        ,
        address,
        library,
        asset,
      ]: typeof marketDataQueryKey = ctx.queryKey;
      console.log(address, library, asset);
      if (!address || !library || !asset) {
        return undefined;
      }
      const lendingPool = AgaveLendingABI__factory.connect(
        internalAddresses.Lending,
        library.getSigner()
      );
      const reserveList = await lendingPool.getReservesList();
      const reserveData = await Promise.all(
        reserveList.map((reserveAsset) =>
          lendingPool
            .getReserveData(reserveAsset)
            .then((result) => [reserveAsset, result] as const)
            .then(
              ([reserveAsset, reserveData]) =>
                [reserveAsset, reserveDataFromWeb3Result(reserveData)] as const
            )
        )
      );
      const assetInfo = Object.fromEntries(
        (
          await Promise.all(
            reserveList.map(
              async (reserveAsset): Promise<AssetData> => {
                const asset = Erc20abi__factory.connect(
                  reserveAsset,
                  library.getSigner()
                );
                const [name, sym] = await Promise.all([
                  asset.name(),
                  asset.symbol(),
                ]);
                return { name, symbol: sym, address: reserveAsset };
              }
            )
          )
        ).map((x) => [x.address, x])
      );

      const reserveMap = Object.fromEntries(reserveData);
      console.log(reserveMap, assetInfo);
      return {
        assets: reserveList,
        reserves: reserveMap as Record<string, ReserveData>,
        assetInfo,
      };
    },
    {
      initialData: undefined,
      staleTime: 1 * 60 * 1000,
      retry: (failureCount, err) => {
        if (failureCount > 3) {
          return false;
        }
        const code = (err as (Error & { code?: ErrorCode })).code;
        if (code !== undefined) {
          switch (code) {
            case ErrorCode.NETWORK_ERROR:
            case ErrorCode.TIMEOUT:
              return true;
            case ErrorCode.NUMERIC_FAULT:
            default:
              return false;
          }
        }
        return true;
      },
    }
  );
  return useMemo(
    () => ({
      assets: data?.assets ?? [],
      reserves: data?.reserves ?? {},
      assetInfo: data?.assetInfo ?? {},
      address,
      library: library ?? undefined,
      marketDataQueryKey,
    }),
    [data, library, address, marketDataQueryKey]
  );
};

export const MarketTable: React.FC<{ activePrice: "USD" | "Native" }> = ({
  activePrice,
}) => {
  const history = useHistory();

  const { assets, assetInfo, reserves } = useMarketData();
  const marketData = useMemo(() => {
    return assets.map(
      (asset) =>
        ({
          assetAddress: asset,
          info: assetInfo[asset],
          reserve: reserves[asset],
        } as const)
    );
  }, [assets, assetInfo, reserves]);

  type DataRow = typeof marketData[0];
  type DataRowAccessor<T> = PropsWithChildren<CellProps<DataRow, T>>;
  const columns: Column<DataRow>[] = useMemo(
    () => [
      {
        id: "reserveId",
        Header: "Reserve ID",
        accessor: (asset) => asset.reserve.id,
      },
      {
        id: "assetSymbol",
        Header: "Assets",
        accessor: (asset) => asset.info.symbol,
        Cell: (row: DataRowAccessor<string>) => {
          const image = imagesBySymbol[row.row.original.info.symbol] ?? null;
          return (
            <span>
              {image != null ? (
                <img src={image} width="35" height="35" alt="" />
              ) : null}
              <span
                title={
                  row.row.original.info.name +
                  " : " +
                  row.row.original.assetAddress
                }
              >
                {row.value}
              </span>
            </span>
          );
        },
      },
      // {
      //   Header: "Market Size",
      //   accessor: row => row.reserve.,
      //   Cell: (row: DataRowAccessor<string>) => {
      //     return activePrice === "USD" ? (
      //       <div className="value-section">
      //         ${" "}
      //         <span className="value">
      //           {(row.value * row.row.original.asset_price).toFixed(2)}
      //         </span>
      //       </div>
      //     ) : (
      //       <span className="value">{row.value}</span>
      //     );
      //   },
      // },
      // {
      //   Header: "Total Borrowed",
      //   accessor: "total_borrowed",
      //   Cell: (row) => {
      //     return activePrice === "USD" ? (
      //       <div className="value-section">
      //         ${" "}
      //         <span className="value">
      //           {(row.value * row.row.original.asset_price).toFixed(2)}
      //         </span>
      //       </div>
      //     ) : (
      //       <span className="value">{row.value}</span>
      //     );
      //   },
      // },
      // {
      //   Header: "Deposit APY",
      //   accessor: "deposit_apy",
      //   Cell: (row) => (
      //     <div className="value-section">
      //       <span className="value yellow">{row.value}</span> %
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Variable Borrow APR",
      //   accessor: "variable_borrow_apr",
      //   Cell: (row) => (
      //     <div className="value-section">
      //       <span className="value blue">{row.value}</span> %
      //     </div>
      //   ),
      // },
      // {
      //   Header: "Stable Borrow APR",
      //   accessor: "stable_borrow_apr",
      //   Cell: (row) => (
      //     <div className="value-section">
      //       <span className="value pink">{row.value}</span> %
      //     </div>
      //   ),
      // },
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
      data: marketData,
    },
    useSortBy
  );

  return (
    <BasicTable>
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, index) => (
                <th
                  // {...column.getHeaderProps(/*column.getSortByToggleProps()*/)}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  key={index}
                >
                  <div className="header-column">
                    <span
                      className={
                        !column.isSorted
                          ? ""
                          : column.isSortedDesc
                          ? "desc"
                          : "asc"
                      }
                    >
                      {column.render("Header")}
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
              <tr
                {...row.getRowProps()}
                onClick={() =>
                  history.push(`/reserve-overview/${row.original.info.symbol}`)
                }
                key={index}
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </BasicTable>
  );
};

export default MarketTable;
