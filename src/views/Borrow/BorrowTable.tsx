import React from "react";
import { bigNumberToString } from "../../utils/fixedPoint"
import { CellProps, Column, Renderer } from "react-table";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useChainAddresses } from "../../utils/chainAddresses";
import {
  BasicTableRenderer,
  MobileTableRenderer,
  SortedHtmlTable,
  TableRenderer,
} from "../../utils/htmlTable";
import { Box, Text } from "@chakra-ui/layout";
import { Center, Flex, useMediaQuery } from "@chakra-ui/react";
import { TokenIcon } from "../../utils/icons";
import { useUserAssetAllowance } from "../../queries/userAssets";
import { PercentageView } from "../common/PercentageView"
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { fixedNumberToPercentage } from "../../utils/fixedPoint"
import { useHistory } from "react-router-dom";

export const APYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);
  // if it's an aToken this will return null. Handle it differently!
  const variableBorrowAPY = reserveProtocolData?.variableBorrowRate;
  
  return React.useMemo(() => {
    if (variableBorrowAPY === undefined) {
      return <>-</>;
    }

    return <PercentageView ratio={fixedNumberToPercentage(variableBorrowAPY, 4, 2)} />;

  }, [variableBorrowAPY]);
};


const BalanceView: React.FC<{ tokenAddress: string, spender: string | undefined }> = ({ tokenAddress, spender }) => {
  const price = useAssetPriceInDai(tokenAddress);
  const balance = useUserAssetAllowance(tokenAddress, spender);
  const balanceNumber = Number(bigNumberToString(balance.data));
  const balanceUSD = balanceNumber
    ? (Number(price.data) * balanceNumber).toFixed(2)
    : "-";

  return React.useMemo(() => {
    return (
      <Flex direction="column" minH={30} ml={2}>
        <Box w="14rem" textAlign="center" whiteSpace="nowrap">
          <Text p={3} fontWeight="bold">
            {balanceNumber?.toFixed(3) ?? "-"}
          </Text>
          <Text p={3}>$ {balanceUSD ?? "-"}</Text>
        </Box>
      </Flex>
    );
  }, [balanceNumber, balanceUSD]);
};

export const BorrowTable: React.FC<{ activeType: string }> = ({
  activeType,
}) => {
  const history = useHistory();
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

  const chainAddresses = useChainAddresses();
  const spender = chainAddresses?.lendingPool;

  const columns: Column<AssetRecord>[] = React.useMemo(
    () => [
      {
        Header: "Asset",
        accessor: record => record.symbol, // We use row.original instead of just record here so we can sort by symbol
        Cell: (({ value }) => (
          <Flex width="100%" height="100%" alignItems={"center"}>
            <Center width="4rem">
              <TokenIcon symbol={value} />
            </Center>
            <Box w="1rem"></Box>

            <Box>
              <Text>{value}</Text>
            </Box>
          </Flex>
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
      {
        Header: "Available to borrow",
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => <BalanceView tokenAddress={value} spender={spender} />) as Renderer<
          CellProps<AssetRecord, string>
        >,
      },
      {
        Header: "APY",
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <APYView tokenAddress={value} />
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
    ],
    [history]
  );

  const mobileRenderer = React.useCallback<TableRenderer<AssetRecord>>(
    table => (
      <MobileTableRenderer
        linkpage="borrow"
        table={table}
        tableProps={{
          textAlign: "center",
          display: "flex",
          width: "100%",
          flexDirection: "column",
        }}
        headProps={{
          fontSize: "12px",
          fontFamily: "inherit",
          color: "white",
          border: "none",
        }}
        rowProps={{
          display: "flex",
          flexDirection: "column",
          margin: "1em 0",
          padding: "1em",
          borderRadius: "1em",
          bg: { base: "secondary.900" },
        }}
        cellProps={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      />
    ),
    []
  );

  const renderer = React.useCallback<TableRenderer<AssetRecord>>(
    table => (
      <BasicTableRenderer
        linkpage="borrow"
        table={table}
        tableProps={{
          style: {
            borderSpacing: "0 1em",
            borderCollapse: "separate",
          },
        }}
        headProps={{
          fontSize: "12px",
          fontFamily: "inherit",
          color: "white",
          border: "none",
        }}
        rowProps={{
          // rounded: { md: "lg" }, // "table-row" display mode can't do rounded corners
          bg: { base: "secondary.900" },
        }}
        cellProps={{
          borderBottom: "none",
          border: "0px solid",
          _first: { borderLeftRadius: "10px" },
          _last: { borderRightRadius: "10px" },
        }}
      />
    ),
    []
  );

  const [ismaxWidth] = useMediaQuery("(max-width: 32em)");

  return (
    <div>
      <SortedHtmlTable columns={columns} data={assetRecords}>
        {ismaxWidth ? mobileRenderer : renderer}
      </SortedHtmlTable>
    </div>
  );
};
