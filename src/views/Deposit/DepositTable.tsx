import React, { useMemo } from "react";
import { CellProps, Column, Renderer } from "react-table";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useDepositAPY } from "../../queries/depositAPY";
import { BasicTableRenderer, SortedHtmlTable, TableRenderer } from "../../utils/htmlTable";
import { Box, Text } from "@chakra-ui/layout";
import { Center, Flex } from "@chakra-ui/react";
import { TokenIcon } from "../../utils/icons";

const DTable: React.FC<{ activeType: string }> = ({ activeType }) => {

  interface AssetRecord {
    symbol: string;
    tokenAddress: string;
    aTokenAddress: string;
  }

  const reserves = useAllReserveTokensWithData();
  const assetRecords = React.useMemo(() => {
    return (
      reserves.data?.map(
        ({ symbol, tokenAddress, aTokenAddress }): AssetRecord => ({
          symbol,
          tokenAddress,
          aTokenAddress,
        })
      ) ?? []
    );
  }, [reserves]);

  console.log(reserves)

  const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
    tokenAddress,
  }) => {
    const query = useDepositAPY(tokenAddress);
    return React.useMemo(() => {
      if (query.data === undefined) {
        return <>-</>;
      }
  
      return <PercentageView value={query.data.round(4).toUnsafeFloat()} />;
    }, [query.data]);
  };

  const PercentageView: React.FC<{
    lowerIsBetter?: boolean;
    positiveOnly?: boolean;
    value: number;
  }> = ({ lowerIsBetter, value, positiveOnly }) => {
    if (lowerIsBetter) {
      throw new Error('PercentageView Mode "lowerIsBetter" not yet supported');
    }
    if (positiveOnly) {
      throw new Error('PercentageView Mode "positiveOnly" not yet supported');
    }
    return (
      <Text color={value >= 0 ? "green.300" : "red.600"}>% {value * 100}</Text>
    );
  };

  const columns: Column<AssetRecord>[] = [
      {
        Header: 'Asset',
        accessor: record => record.symbol, // We use row.original instead of just record here so we can sort by symbol
        Cell: (({ value, row }) => (
          <Flex alignItems={"center"}>
            <Box>
              <TokenIcon symbol={value} />
            </Box>
            <Box w="1rem"></Box>
            <Box>
              <Text>{value}</Text>
            </Box>
          </Flex>
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
      {
        Header: 'Your wallet balance',
        accessor: row => row.tokenAddress,
        Cell: (() => (
          <Flex alignItems={"center"}>
            <Box>
              0 {/* here will be added the value coming from the wallet */}
            </Box>
          </Flex>
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
      {
        Header: 'APY',
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <DepositAPYView tokenAddress={value} />
        )) as Renderer<CellProps<AssetRecord, string>>,
      }
    ];

    const renderer = React.useMemo<TableRenderer<AssetRecord>>(
      () => table =>
        (
          <BasicTableRenderer
            table={table}
            tableProps={{
              style: {
                borderSpacing: "0 1.5em",
                borderCollapse: "separate",
              },
            }}
            headProps={{
              fontSize : "12px",
              fontFamily: "inherit",
              color: "white",
              border: "none",
            }}
            rowProps={{
              // rounded: { md: "lg" }, // "table-row" display mode can't do rounded corners
              bg: { base: "secondary.500", md: "secondary.900" },
            }}
            cellProps={{
              borderBottom: "none",
            }}
          />
        ),
      []
    );

    return (
      <div>
        <SortedHtmlTable columns={columns} data={assetRecords} >
          {renderer}
        </SortedHtmlTable>
      </div>
  );
}

export default DTable;
