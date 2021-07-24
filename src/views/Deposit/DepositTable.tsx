import React from "react";
import { bigNumberToString } from "../../utils/fixedPoint";
import { CellProps, Column, Renderer } from "react-table";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import {
  BasicTableRenderer,
  MobileTableRenderer,
  SortedHtmlTable,
  TableRenderer,
} from "../../utils/htmlTable";
import { DepositAPYView } from "../common/RatesView";
import { Box, Text } from "@chakra-ui/layout";
import { Center, Flex, useMediaQuery } from "@chakra-ui/react";
import { TokenIcon } from "../../utils/icons";
import { useUserAssetBalance } from "../../queries/userAssets";
import { Link, useHistory } from "react-router-dom";

const BalanceView: React.FC<{ tokenAddress: string }> = ({ tokenAddress }) => {
  const price = useAssetPriceInDai(tokenAddress);
  const balance = useUserAssetBalance(tokenAddress);
  const balanceNumber = Number(bigNumberToString(balance.data));
  const balanceUSD = balanceNumber
    ? (Number(price.data) * balanceNumber).toFixed(2)
    : "-";

  const [isMobile] = useMediaQuery("(max-width: 32em)");

  return React.useMemo(() => {
    return (
      <Flex direction="column" minH={30} ml={2}>
        <Box textAlign={{ base: "end", md: "center" }} whiteSpace="nowrap">
          <Text p={3} fontWeight="bold">
            {balanceNumber?.toFixed(3) ?? "-"}
          </Text>
          {isMobile ? null : <Text p={3}>$ {balanceUSD ?? "-"}</Text>}
        </Box>
      </Flex>
    );
  }, [balanceNumber, balanceUSD]);
};

export const DepositTable: React.FC<{ activeType: string }> = ({
  activeType,
}) => {
  const history = useHistory();
  interface AssetRecord {
    symbol: string;
    tokenAddress: string;
    aTokenAddress: string;
  }
  const [isMobile] = useMediaQuery("(max-width: 32em)");

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

  const columns: Column<AssetRecord>[] = React.useMemo(
    () => [
      {
        Header: "Asset",
        accessor: record => record.symbol, // We use row.original instead of just record here so we can sort by symbol
        Cell: (({ value }) => (
          <Flex
            width="100%"
            height="100%"
            alignItems={"center"}
            mb={{ base: "2rem", md: "0rem" }}
          >
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
        Header: isMobile ? "Your wallet" : "Your wallet balance",
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => <BalanceView tokenAddress={value} />) as Renderer<
          CellProps<AssetRecord, string>
        >,
      },
      {
        Header: isMobile ? "APY" : "Deposit APY",
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <DepositAPYView tokenAddress={value} />
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
    ],
    [history]
  );

  const mobileRenderer = React.useCallback<TableRenderer<AssetRecord>>(
    table => (
      <MobileTableRenderer
        linkpage="deposit"
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
          whiteSpace: "nowrap",
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
        linkpage="deposit"
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
          textAlign: "center",
          _first: { textAlign: "start" },
        }}
        rowProps={{
          // rounded: { md: "lg" }, // "table-row" display mode can't do rounded corners
          bg: { base: "secondary.900" },
          whiteSpace: "nowrap",
        }}
        cellProps={{
          borderBottom: "none",
          border: "0px solid",
          textAlign: "center",
          _first: { borderLeftRadius: "10px", textAlign: "start" },
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
