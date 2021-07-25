import React from "react";
import { CellProps, Column, Renderer, useRowSelect } from "react-table";
import {
  BasicTableRenderer,
  SortedHtmlTable,
  TableRenderer,
} from "../../utils/htmlTable";
import { BalanceView } from "../common/BalanceView";
import { DepositAPYView, BorrowAPRView } from "../common/RatesView";
import { Box, Text } from "@chakra-ui/layout";
import { Button, Flex, Switch } from "@chakra-ui/react";
import { TokenIcon, ModalIcon } from "../../utils/icons";
import ColoredText from "../../components/ColoredText";
import { AssetData } from ".";
import {
  useUserReserveData,
  ProtocolReserveData,
} from "../../queries/protocolReserveData";
import { useHistory, Link } from "react-router-dom";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { BigNumber } from "ethers";
import { fontSizes } from "../../utils/constants";
import { ModalComponent } from "./layout";

export enum DashboardTableType {
  Deposit = "Deposit",
  Borrow = "Borrow",
}

const CollateralView: React.FC<{ tokenAddress: string | undefined }> = ({
  tokenAddress,
}) => {
  const { data: reserveConfiguration } = useUserReserveData(tokenAddress);
  const reserveUsedAsCollateral =
    reserveConfiguration?.usageAsCollateralEnabled;
  return React.useMemo(() => {
    // Using onChange={toggleUseAssetAsCollateral} from the Switch in the CollateralView Component
    const toggleUseAssetAsCollateral = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const tokenAddress = e.target.id;
      console.log(tokenAddress, reserveUsedAsCollateral);
    };

    return (
      <Box d="flex" flexDir="row" alignItems="center" justifyContent="center">
        <Text
          fontWeight="bold"
          width="60px"
          color={reserveUsedAsCollateral ? "green.300" : "orange.300"}
        >
          {reserveUsedAsCollateral ? "Yes" : "No"}
        </Text>
        <Switch
          size="md"
          colorScheme="yellow"
          isChecked={reserveUsedAsCollateral}
          id={tokenAddress}
          onChange={toggleUseAssetAsCollateral}
        />
      </Box>
    );
  }, [reserveUsedAsCollateral]);
};

export const DashboardTable: React.FC<{
  mode: DashboardTableType;
  assets: AssetData[];
}> = ({ mode, assets }) => {
  const history = useHistory();
  const onActionClicked = React.useCallback(
    (route: String, asset: Readonly<ReserveTokenDefinition>) => {
      if (route === "Deposit-Borrow") {
        if (mode === DashboardTableType.Deposit) {
          history.push(`/deposit/${asset.symbol}`);
        } else if (mode === DashboardTableType.Borrow) {
          history.push(`/borrow/${asset.symbol}`);
        }
      } else if (route === "Withdraw-Repay") {
        if (mode === DashboardTableType.Deposit) {
          history.push(`/withdraw/${asset.symbol}`);
        } else if (mode === DashboardTableType.Borrow) {
          history.push(`/repay/${asset.symbol}`);
        }
      }
    },
    [mode, history]
  );

  const columns: Column<AssetData>[] = React.useMemo(
    () => [
      {
        Header:
          mode === DashboardTableType.Borrow ? "My Borrows" : "My Deposits",
        accessor: row => row.symbol, // We use row.original instead of just record here so we can sort by symbol
        Cell: (({ value, row }) => (
          <Link
            to={`/reserve-overview/${
              row.original.backingReserve?.symbol
                ? row.original.backingReserve?.symbol
                : value
            }`}
          >
            <Flex alignItems={"center"}>
              <Box>
                <TokenIcon symbol={value} />
              </Box>
              <Box w="1rem"></Box>
              <Box>
                {mode === DashboardTableType.Deposit ? (
                  <Text>{row.original.backingReserve?.symbol}</Text>
                ) : (
                  <Text>{value}</Text>
                )}
              </Box>
            </Flex>
          </Link>
        )) as Renderer<CellProps<AssetData, string>>,
      },
      {
        Header: mode === DashboardTableType.Borrow ? "Borrowed" : "Deposited",
        accessor: row => row.balance,
        Cell: (({ value }) => <BalanceView balanceBN={value} />) as Renderer<
          CellProps<AssetData, BigNumber>
        >,
      },
      {
        Header: mode === DashboardTableType.Borrow ? "APR" : "APY",
        accessor: row => row.tokenAddress,
        Cell: (({ value }) => (
          /* There's a difference between the deposit APY and the borrow APR.
             Lending rates are obviously higher than borrowing rates */
          <DepositAPYView tokenAddress={value} />
        )) as Renderer<CellProps<AssetData, string>>,
      },
      {
        Header: "Collateral",
        accessor: row => row.backingReserve,
        Cell: (({ row }) =>
          mode === DashboardTableType.Deposit && row.original.backingReserve ? (
            <CollateralView
              tokenAddress={row.original.backingReserve?.tokenAddress}
            />
          ) : (
            <></>
          )) as Renderer<CellProps<AssetData, string>>,
        /* drop the collateralView make this button toggle directly a mutation call */
      },
      {
        Header: mode === DashboardTableType.Borrow ? "Actions" : "Actions",
        accessor: row => row.tokenAddress,
        Cell: (({ row }) => (
          <Box
            d="flex"
            flexDir="row"
            alignItems="center"
            justifyContent="center"
          >
            <Button
              fontSize={{ base: fontSizes.md, md: fontSizes.lg }}
              bg="secondary.900"
              _hover={{ bg: "primary.50" }}
              mr="1rem"
              onClick={() =>
                onActionClicked("Deposit-Borrow", {
                  symbol:
                    row.original.backingReserve?.symbol ?? row.original.symbol,
                  tokenAddress:
                    row.original.backingReserve?.tokenAddress ??
                    row.original.tokenAddress,
                })
              }
            >
              <ColoredText fontWeight="400">
                {mode === DashboardTableType.Borrow ? "Borrow" : "Deposit"}
              </ColoredText>
            </Button>
            <Button
              fontSize={{ base: fontSizes.sm, md: fontSizes.md }}
              borderColor="primary.50"
              color="primary.50"
              fontWeight="400"
              variant="outline"
              _hover={{ bg: "white" }}
              onClick={() =>
                onActionClicked("Withdraw-Repay", {
                  symbol:
                    row.original.backingReserve?.symbol ?? row.original.symbol,
                  tokenAddress:
                    row.original.backingReserve?.tokenAddress ??
                    row.original.tokenAddress,
                })
              }
            >
              {mode === DashboardTableType.Borrow ? "Repay" : "Withdraw"}
            </Button>
          </Box>
        )) as Renderer<CellProps<AssetData, string>>,
      },
    ],
    [mode, onActionClicked]
  );

  const filterColumns =
    mode === DashboardTableType.Deposit ? columns : columns?.splice(3, 1);

  const renderer = React.useMemo<TableRenderer<AssetData>>(
    () => table =>
      (
        <BasicTableRenderer
          table={table}
          tableProps={{
            style: {
              borderSpacing: "0 1em",
              borderCollapse: "separate",
              width: "100%",
            },
          }}
          headProps={{
            fontSize: "lg",
            fontFamily: "inherit",
            color: "white",
            border: "0px solid ",
            maxWidth: "15rem",
            whiteSpace: "nowrap",
          }}
          rowProps={{
            // rounded: { md: "lg" }, // "table-row" display mode can't do rounded corners
            bg: "primary.900",
            color: "white",
            whiteSpace: "nowrap",
          }}
          cellProps={{
            borderBottom: "none",
            border: "0px solid",
            maxWidth: "15rem",
            paddingInlineStart: "0.1rem",
            paddingInlineEnd: "0.1rem",
            _first: { borderLeftRadius: "10px", paddingInlineStart: "1rem" },
            _last: { borderRightRadius: "10px", paddingInlineEnd: "1rem" },
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
