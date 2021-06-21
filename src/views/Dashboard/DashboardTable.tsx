import React from "react";
import { ethers } from "ethers";
import { CellProps, Column, Renderer } from "react-table";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useDepositAPY } from "../../queries/depositAPY";
import { BasicTableRenderer, SortedHtmlTable, TableRenderer } from "../../utils/htmlTable";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Flex, Switch } from "@chakra-ui/react";
import { TokenIcon } from "../../utils/icons";
import { useUserAssetBalance } from "../../queries/userAssets";
import ColoredText from "../../components/ColoredText";

export enum DashboardTableType {
  Deposit = "DEP",
  Borrow = "BORR",
};

const DashboardTable: React.FC<{mode: DashboardTableType}> = ({mode}) => {

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

  const BalanceView: React.FC<{ tokenAddress: string }> = ({  
    tokenAddress,
  }) => {
    
    const price = useAssetPriceInDai(tokenAddress);
    const balance = useUserAssetBalance(tokenAddress);
    const balanceNumber = balance.data ? Number(ethers.utils.formatEther(balance.data)) : undefined;
    const balanceUSD = balanceNumber ? (Number(price.data) * balanceNumber).toFixed(2) : "-";

    return React.useMemo(() => {
      return (
        <Box minWidth="8rem" textAlign="left">
          <Text p={3}>
            {balanceUSD ?? "-"}
          </Text>
        </Box>
      );
    }, [balanceUSD]);
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
      <Text fontWeight="bold" color={value >= 0 ? "yellow.100" : "red.600"}>% {value * 100}</Text>
    );
  };

  const columns: Column<AssetRecord>[] = [
      {
        Header: mode === DashboardTableType.Borrow ? 'My Borrows' : 'My Deposits',
        accessor: record => record.symbol, // We use row.original instead of just record here so we can sort by symbol
        Cell: (({ value, row }) => (
          <Flex alignItems={"center"} >
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
        Header: mode === DashboardTableType.Borrow ? 'Borrowed' : 'Deposited',
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <BalanceView tokenAddress={value} />
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
      {
        Header: mode === DashboardTableType.Borrow ? 'APR' : 'APY',
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <DepositAPYView tokenAddress={value} />
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
      {
        Header: mode === DashboardTableType.Borrow ? 'APR Type': 'Collateral',
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <Box d="flex" flexDir="row" alignItems="center" justifyContent="space-between">
            <Text fontWeight="bold">
              {mode === DashboardTableType.Deposit ? "No" : "Variable"}
            </Text>
            <Switch size="sm" colorScheme="gray" />
            <Button 
              bg="secondary.900"
              _hover={{ bg: "primary.50" }}
            >
              <ColoredText
                fontSize="1rem"
                fontWeight="400"
              >
                {mode === DashboardTableType.Borrow ? 'Borrow' : 'Deposit'}
              </ColoredText>
            </Button>
            <Button
              borderColor="primary.50"
              color="primary.50"
              fontWeight="400"
              variant="outline"
              _hover={{ bg: "white" }}
            >
              {mode === DashboardTableType.Borrow ? 'Repay' : 'Withdraw'}
            </Button>
          </Box>
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
    ];

    const renderer = React.useMemo<TableRenderer<AssetRecord>>(
      () => table =>
        (
          <BasicTableRenderer
            table={table}
            tableProps={{
              style: {
                borderSpacing: "0 1em",
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
              bg: "primary.900",
              color: "white",
            }}
            cellProps={{
              borderBottom: "none",
            }}
          />
        ),
      []
    );

    return (
      <SortedHtmlTable columns={columns} data={assetRecords} >
        {renderer}
      </SortedHtmlTable>
  );
}

export default DashboardTable;
