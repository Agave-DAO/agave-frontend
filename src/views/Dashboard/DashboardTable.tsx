import React from "react";
import { ethers } from "ethers";
import { CellProps, Column, Renderer } from "react-table";
import { useDepositAPY } from "../../queries/depositAPY";
import {
  BasicTableRenderer,
  SortedHtmlTable,
  TableRenderer,
} from "../../utils/htmlTable";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Flex, Switch } from "@chakra-ui/react";
import { TokenIcon } from "../../utils/icons";
import ColoredText from "../../components/ColoredText";
import { AssetData } from ".";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";

export enum DashboardTableType {
  Deposit = "Deposit",
  Borrow = "Borrow",
}

const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);
  const variableDepositAPY = reserveProtocolData?.variableBorrowRate;
  
  return React.useMemo(() => {
    if (variableDepositAPY === undefined) {
      return <>-</>;
    }
    
    return <PercentageView value={(variableDepositAPY.toUnsafeFloat() * 100)} />;
  }, [variableDepositAPY]);
};

const BalanceView: React.FC<{ balanceBN: string }> = ({
  balanceBN,
}) => {
  const balance = ethers.utils.formatEther(balanceBN ?? 0)
  return React.useMemo(() => {
    return (
      <Box minWidth="8rem" textAlign="left">
        <Text p={3}>{balance ?? "-"}</Text>
      </Box>
    );
  }, [balance]);
};

const CollateralView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress
}) => {
  const { data: reserveConfiguration } = useProtocolReserveConfiguration(tokenAddress);
  const isCollateralized = reserveConfiguration?.usageAsCollateralEnabled;

  return React.useMemo(() => {
    return (
      <Switch size="sm" colorScheme="gray" isDisabled={isCollateralized} />
    );
  }, [isCollateralized]);
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
    <Text fontWeight="bold" color={value >= 0 ? "yellow.100" : "red.600"}>
      % {value * 100}
    </Text>
  );
};

const DashboardTable: React.FC<{ 
  mode: DashboardTableType;
  assets: AssetData[];
}> = ({ mode, assets }) => {

  const columns: Column<AssetData>[] = [
    {
      Header: mode === DashboardTableType.Borrow ? "My Borrows" : "My Deposits",
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
      )) as Renderer<CellProps<AssetData, string>>,
    },
    {
      Header: mode === DashboardTableType.Borrow ? "Borrowed" : "Deposited",
      accessor: row => row.balance,
      Cell: (({ value }) => <BalanceView balanceBN={value} />) as Renderer<
        CellProps<AssetData, string>
      >,
    },
    {
      Header: mode === DashboardTableType.Borrow ? "APR" : "APY",
      accessor: row => row.tokenAddress,
      Cell: (({ value }) => (
        <DepositAPYView tokenAddress={value} />
      )) as Renderer<CellProps<AssetData, string>>,
    },
    {
      Header: mode === DashboardTableType.Borrow ? "APR Type" : "Collateral",
      accessor: row => row.tokenAddress,
      Cell: (({ value }) => (
        <Box
          d="flex"
          flexDir="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text fontWeight="bold">
            {mode === DashboardTableType.Deposit ? "No" : "Variable"}
          </Text>
          <CollateralView tokenAddress={value} />
          <Button bg="secondary.900" _hover={{ bg: "primary.50" }}>
            <ColoredText fontSize="1rem" fontWeight="400">
              {mode === DashboardTableType.Borrow ? "Borrow" : "Deposit"}
            </ColoredText>
          </Button>
          <Button
            borderColor="primary.50"
            color="primary.50"
            fontWeight="400"
            variant="outline"
            _hover={{ bg: "white" }}
          >
            {mode === DashboardTableType.Borrow ? "Repay" : "Withdraw"}
          </Button>
        </Box>
      )) as Renderer<CellProps<AssetData, string>>,
    },
  ];

  const renderer = React.useMemo<TableRenderer<AssetData>>(
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
            fontSize: "12px",
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
    <SortedHtmlTable columns={columns} data={assets}>
      {renderer}
    </SortedHtmlTable>
  );
};

export default DashboardTable;
