import React, { useEffect, useState } from "react";
import { CellProps, Column, Renderer } from "react-table";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useAssetPricesInDaiWei } from "../../queries/assetPriceInDai";
import { useChainAddresses } from "../../utils/chainAddresses";
import {
  BasicTableRenderer,
  MobileTableRenderer,
  SortedHtmlTable,
  TableRenderer,
} from "../../utils/htmlTable";
import { Box, Text } from "@chakra-ui/layout";
import { Center, Flex, useMediaQuery, Spinner } from "@chakra-ui/react";
import { TokenIcon, useNativeSymbols } from "../../utils/icons";
import { useUserAccountData } from "../../queries/userAccountData";
import { bigNumberToString } from "../../utils/fixedPoint";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { isMobile } from "react-device-detect";
import { BorrowAPRView } from "../common/RatesView";
import {
  ReserveAssetConfiguration,
  useMultipleProtocolReserveConfiguration,
} from "../../queries/protocolAssetConfiguration";

const BorrowAvailability: React.FC<{
  tokenAddress: string;
  lendingPool: string | undefined;
}> = ({ tokenAddress, lendingPool }) => {
  const { account: userAccountAddress } = useAppWeb3();

  const price = useAssetPricesInDaiWei([tokenAddress]).data;
  const userAccountData = useUserAccountData(
    userAccountAddress ?? undefined
  ).data;
  const availableBorrowsNative = userAccountData?.availableBorrowsEth;
  const balanceNative = availableBorrowsNative
    ? bigNumberToString(availableBorrowsNative)
    : null;

  const availableBorrowsNativeAdjusted = availableBorrowsNative?.mul(1000);
  const balanceAsset =
    availableBorrowsNativeAdjusted && price
      ? availableBorrowsNativeAdjusted.div(price[0])
      : null;
  return React.useMemo(() => {
    return (
      <Flex direction="column" minH={30} ml={2}>
        <Box
          w="auto"
          textAlign={{ base: "end", md: "center" }}
          whiteSpace="nowrap"
        >
          <Text p={3} fontWeight="bold">
            {balanceAsset ? (
              balanceAsset.toNumber() / 1000
            ) : (
              <Spinner speed="0.5s" emptyColor="gray.200" color="yellow.500" />
            )}
          </Text>

          {isMobile ? null : <Text p={3}>$ {balanceNative ?? "-"}</Text>}
        </Box>
      </Flex>
    );
  }, [balanceAsset, balanceNative, isMobile]);
};

export const BorrowTable: React.FC<{ activeType: string }> = () => {
  interface AssetRecord {
    symbol: string;
    tokenAddress: string;
    aTokenAddress: string;
  }

  const [tokenConfigs, setTokenConfigs] = useState<any[]>([]);
  const [isMobile] = useMediaQuery("(max-width: 32em)");

  const reserves = useAllReserveTokensWithData();
  const reserveAddresses = reserves.data?.map(
    ({ tokenAddress }) => tokenAddress
  );

  const tokenReservesConfigs:
    | Array<ReserveAssetConfiguration & { tokenAddress: string }>
    | undefined =
    useMultipleProtocolReserveConfiguration(reserveAddresses)?.data;

  useEffect(() => {
    if (tokenReservesConfigs) {
      Promise.all(tokenReservesConfigs).then((tokens: any) => {
        tokens.forEach((token: any) => {
          setTokenConfigs(tokenConfigs => [...tokenConfigs, token]);
        });
      });
    }
  }, [tokenReservesConfigs]);

  const nativeSymbols = useNativeSymbols();
  const assetRecords = React.useMemo(() => {
    const assets =
      reserves.data?.map(
        ({ symbol, tokenAddress, aTokenAddress }): AssetRecord => ({
          symbol,
          tokenAddress,
          aTokenAddress,
        })
      ) ?? [];
    return assets
      .map(asset => {
        return asset.symbol === nativeSymbols.wrappednative
          ? {
              ...asset,
              symbol: nativeSymbols?.native,
            }
          : asset;
      })
      .filter(asset => {
        const config = tokenConfigs.find(
          (tokenConfig: ReserveAssetConfiguration & { tokenAddress: string }) =>
            tokenConfig.tokenAddress === asset.tokenAddress
        );
        return config?.isActive && !config?.isFrozen;
      });
  }, [reserves]);

  const chainAddresses = useChainAddresses();
  const lendingPool = chainAddresses?.lendingPool;

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
        Header: "You can Borrow",
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <BorrowAvailability tokenAddress={value} lendingPool={lendingPool} />
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
      {
        Header: isMobile ? "APR" : "Variable APR",
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          <BorrowAPRView tokenAddress={value} />
        )) as Renderer<CellProps<AssetRecord, string>>,
      },
    ],
    [isMobile, lendingPool]
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
          textAlign: "center",
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
