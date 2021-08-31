import React from "react";
import ColoredText from "../../components/ColoredText";
import { Box, Text } from "@chakra-ui/layout";
import { Center, Flex, useMediaQuery } from "@chakra-ui/react";
import {
  useMarketSizeInDai,
  useTotalMarketSize,
} from "../../queries/marketSize";
import { buildQueryHookWhenParamsDefinedChainAddrs } from "../../utils/queryBuilder";
import { fixedNumberToPercentage } from "../../utils/fixedPoint";
import { FixedNumber } from "ethers";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { CellProps, Column, Renderer } from "react-table";
import { useTotalBorrowedForAsset } from "../../queries/totalBorrowedForAsset";
import { weiPerToken } from "../../queries/decimalsForToken";
import {
  useDepositAPY,
  useStableBorrowAPR,
  useVariableBorrowAPR,
} from "../../queries/depositAPY";
import { PercentageView } from "../common/PercentageView";
import { TokenIcon } from "../../utils/icons";
import {
  BasicTableRenderer,
  SortedHtmlTable,
  TableRenderer,
  MobileTableRenderer,
} from "../../utils/htmlTable";

const useTotalMarketSizeInDai = buildQueryHookWhenParamsDefinedChainAddrs<
  FixedNumber,
  ["markets", "totalMarketSize", "wholeDai"],
  []
>(
  async params => {
    const totalWei = await useTotalMarketSize.fetchQueryDefined(params);
    return FixedNumber.fromValue(totalWei, 18); // HACK: Assumes DAI are always 18 decimals
  },
  () => ["markets", "totalMarketSize", "wholeDai"],
  () => undefined
);

export const MarketsBanner: React.FC<{}> = () => {
  const totalMarketSize = useTotalMarketSizeInDai();
  return (
    <Flex
      flexDir="column"
      justifyItems="stretch"
      height="auto"
      marginRight="auto"
    >
      <Text align="left" fontSize="3xl">
        Current Market Size:
      </Text>
      <ColoredText fontSize="5xl">
        ${" "}
        {totalMarketSize.data?.round(2).toUnsafeFloat().toLocaleString() ?? "-"}
      </ColoredText>
    </Flex>
  );
};

export interface AssetRecord {
  symbol: string;
  tokenAddress: string;
  aTokenAddress: string;
}

const PriceView: React.FC<{ tokenAddress: string }> = ({ tokenAddress }) => {
  const price = useAssetPriceInDai(tokenAddress);

  return React.useMemo(() => {
    return (
      <Text>
        $ {price.data?.round(2).toUnsafeFloat().toLocaleString() ?? "-"}
      </Text>
    );
  }, [price.data]);
};

const MarketSizeView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const marketSize = useMarketSizeInDai(tokenAddress);
  const marketSizeInDai = React.useMemo(
    () => marketSize.data?.round(2).toUnsafeFloat().toLocaleString() ?? null,
    [marketSize.data]
  );

  return React.useMemo(() => {
    if (marketSizeInDai !== null) {
      return <Text>$ {marketSizeInDai.toString()}</Text>;
    } else {
      return <Text>$ -</Text>;
    }
  }, [marketSizeInDai]);
};

const TotalBorrowedView: React.FC<{
  assetSymbol: string;
  tokenAddress: string;
}> = ({ tokenAddress }) => {
  const totalBorrowed = useTotalBorrowedForAsset(tokenAddress);

  return React.useMemo(() => {
    const data = totalBorrowed.data;
    if (data && data.dai !== null) {
      const daiString = data.dai.round(2).toUnsafeFloat().toLocaleString();
      const weiString = (
        data.wei.mul(1000).div(weiPerToken(data.assetDecimals)).toNumber() /
        1000
      ).toLocaleString();
      return (
        <Flex
          alignItems={"center"}
          flexDirection={"column"}
          justifyContent="space-evenly"
        >
          <Text>{weiString}</Text>
          <Text mt="4px" fontSize={{ base: "1.2rem", lg: "1.1rem" }}>
            $ {daiString}
          </Text>
        </Flex>
      );
    } else if (data) {
      return <Text>{data.wei.toString()} wei</Text>;
    } else {
      return <Text>$ -</Text>;
    }
  }, [totalBorrowed.data]);
};

const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const query = useDepositAPY(tokenAddress);
  return React.useMemo(() => {
    if (query.data === undefined) {
      return <>-</>;
    }
    const depositAPY = query.data;
    return <PercentageView ratio={fixedNumberToPercentage(depositAPY, 3, 2)} />;
  }, [query.data]);
};

const VariableAPRView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const query = useVariableBorrowAPR(tokenAddress);
  return React.useMemo(() => {
    if (query.data === undefined) {
      return <>-</>;
    }
    const variableBorrowAPR = query.data;
    return (
      <PercentageView
        ratio={fixedNumberToPercentage(variableBorrowAPR, 3, 2)}
      />
    );
  }, [query.data]);
};

const StableAPRView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const query = useStableBorrowAPR(tokenAddress);
  return React.useMemo(() => {
    if (query.data === undefined) {
      return <>-</>;
    }
    const stableBorrowAPR = query.data;
    return (
      <PercentageView ratio={fixedNumberToPercentage(stableBorrowAPR, 3, 2)} />
    );
  }, [query.data]);
};

const AssetTable: React.FC<{
  viewMode: "native" | "usd";
}> = ({ viewMode }) => {
  if (viewMode !== "usd") {
    throw new Error("AssetTable native view mode not yet supported");
  }

  const reserves = useAllReserveTokensWithData();
  const assetRecords = React.useMemo(() => {
    const assets =
      reserves.data?.map(
        ({ symbol, tokenAddress, aTokenAddress }): AssetRecord => ({
          symbol,
          tokenAddress,
          aTokenAddress,
        })
      ) ?? [];
    return assets.map(asset => {
      return asset.symbol === "WXDAI"
        ? {
            ...asset,
            symbol: "XDAI",
          }
        : asset;
    });
  }, [reserves]);

  const columns: Column<AssetRecord>[] = [
    {
      id: "symbol",
      Header: "Asset",
      accessor: record => record.symbol, // We use row.original instead of just record here so we can sort by symbol
      Cell: (({ value, row }) => (
        <Flex alignItems={"center"}>
          <Box>
            <TokenIcon symbol={value} />
          </Box>
          <Box w="1rem"></Box>
          <Box>
            <Text color="white">{value}</Text>
          </Box>
        </Flex>
      )) as Renderer<CellProps<AssetRecord, string>>,
    },
    {
      id: "price",
      Header: "Price",
      accessor: record => record.tokenAddress,
      Cell: (({ value }) => (
        <Center>
          <PriceView tokenAddress={value} />
        </Center>
      )) as Renderer<CellProps<AssetRecord, string>>,
      disableSortBy: true,
    },
    {
      id: "marketSize",
      Header: "Market Size",
      accessor: record => record.tokenAddress,
      Cell: (({ value }) => (
        <Center>
          <MarketSizeView tokenAddress={value} />
        </Center>
      )) as Renderer<CellProps<AssetRecord, string>>,
      disableSortBy: true,
    },
    {
      id: "totalBorrowed",
      Header: "Total Borrowed",
      accessor: row => row,
      Cell: (({ value }) => (
        <TotalBorrowedView
          assetSymbol={value.symbol}
          tokenAddress={value.tokenAddress}
        />
      )) as Renderer<CellProps<AssetRecord, AssetRecord>>,
      disableSortBy: true,
    },
    {
      id: "depositAPY",
      Header: "Deposit APY",
      accessor: row => row.tokenAddress,
      Cell: (({ value }) => (
        <Center>
          <DepositAPYView tokenAddress={value} />
        </Center>
      )) as Renderer<CellProps<AssetRecord, string>>,
      disableSortBy: true,
    },
    {
      id: "variableBorrowAPR",
      Header: "Variable Borrow APR",
      accessor: row => row.tokenAddress,
      Cell: (({ value }) => (
        <Center>
          <VariableAPRView tokenAddress={value} />
        </Center>
      )) as Renderer<CellProps<AssetRecord, string>>,
      disableSortBy: true,
    },
    {
      id: "stableBorrowAPR",
      Header: "Stable Borrow APR",
      accessor: row => row.tokenAddress,
      Cell: (({ value }) => (
        <Center>
          <StableAPRView tokenAddress={value} />
        </Center>
      )) as Renderer<CellProps<AssetRecord, string>>,
      disableSortBy: true,
    },
  ];

  const renderer = React.useMemo<TableRenderer<AssetRecord>>(
    () => table =>
      (
        <BasicTableRenderer
          linkpage="reserve-overview"
          table={table}
          tableProps={{
            style: {
              borderSpacing: "0 1.5em",
              borderCollapse: "separate",
            },
          }}
          headProps={{
            fontSize: "12px",
            fontFamily: "inherit",
            color: "white",
            border: "none",
            textAlign: "center",
          }}
          rowProps={{
            // rounded: { md: "lg" }, // "table-row" display mode can't do rounded corners
            bg: { base: "primary.500", md: "primary.900" },
            whiteSpace: "nowrap",
            height: "69px",
          }}
          cellProps={{
            borderBottom: "none",
            _first: { borderLeftRadius: "10px" },
            _last: { borderRightRadius: "10px" },
          }}
        />
      ),
    []
  );

  const mobileRenderer = React.useCallback<TableRenderer<AssetRecord>>(
    table => (
      <MobileTableRenderer
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
          bg: { base: "secondary.500" },
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

  const [ismaxWidth] = useMediaQuery("(max-width: 50em)");

  return (
    <SortedHtmlTable columns={columns} data={assetRecords}>
      {ismaxWidth ? mobileRenderer : renderer}
    </SortedHtmlTable>
  );
};

export const Markets: React.FC<{}> = () => {
  return (
    <Box
      rounded={{ md: "lg" }}
      minH={{ base: "6.6rem", md: "9.6rem" }}
      // bg={{ base: "primary.500", md: "primary.900" }}
      fg={{ base: "primary.100", md: "primary.100" }}
      color={{ base: "primary.100", md: "primary.100" }}
    >
      <AssetTable viewMode="usd" />
    </Box>
  );
};
