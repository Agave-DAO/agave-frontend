import React from "react";
import { CellProps, Column, Renderer } from "react-table";
import {
  BasicTableRenderer,
  SortedHtmlTable,
  TableRenderer,
} from "../../utils/htmlTable";
import { BalanceView } from "../common/BalanceView"
import { DepositAPYView } from "../common/DepositAPYView"
import { Box, Text } from "@chakra-ui/layout";
import { Button, Flex, Switch } from "@chakra-ui/react";
import { TokenIcon } from "../../utils/icons";
import ColoredText from "../../components/ColoredText";
import { AssetData } from ".";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";

export enum DashboardTableType {
  Deposit = "Deposit",
  Borrow = "Borrow",
}

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

const DashboardTable: React.FC<{ 
  mode: DashboardTableType;
  assets: AssetData[];
}> = ({ mode, assets }) => {

  const columns: Column<AssetData>[] = React.useMemo(
    () => [
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
    ],
    [mode]
  );

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
