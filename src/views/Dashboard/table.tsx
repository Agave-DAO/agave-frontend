import { Box, Text } from "@chakra-ui/layout";
import {
  Button,
  Flex,
  Spinner,
  Switch,
  Tooltip,
  useMediaQuery,
} from "@chakra-ui/react";
import { LockIcon, SmallCloseIcon } from "@chakra-ui/icons";
import { BigNumber } from "ethers";
import React from "react";
import { isMobile, isDesktop } from "react-device-detect";
import { Link, useHistory } from "react-router-dom";
import { CellProps, Column, Renderer, useRowSelect } from "react-table";
import { AssetData } from ".";
import ColoredText from "../../components/ColoredText";
import { useCollateralModeMutation } from "../../mutations/collateralMode";
import { useUserReserveData } from "../../queries/protocolReserveData";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { fontSizes } from "../../utils/constants";
import {
  BasicTableRenderer,
  SortedHtmlTable,
  TableRenderer,
} from "../../utils/htmlTable";
import { TokenIcon } from "../../utils/icons";
import { BalanceView } from "../common/BalanceView";
import { BorrowAPRView, DepositAPYView } from "../common/RatesView";

export enum DashboardTableType {
  Deposit = "Deposit",
  Borrow = "Borrow",
}

const ThreeStateSwitch: React.FC<{
  state: boolean | null;
  active: boolean | null;
  onClick: (previousState: boolean | null) => void;
}> = ({ state, active, onClick }) => {
  console.log("active", active, state);
  const onClickWrapped = React.useCallback(() => {
    onClick(state);
  }, [state, onClick]);

  return React.useMemo(
    () => (
      <Box d="flex" flexDir="row" alignItems="center" justifyContent="center">
        <Text
          fontWeight="bold"
          color={
            state === null ? "grey.300" : state ? "green.300" : "orange.300"
          }
        >
          {state === null ? (
            <Spinner speed="0.5s" emptyColor="gray.200" color="yellow.500" />
          ) : state && active === true ? (
            "Yes"
          ) : active ? (
            "No"
          ) : (
            <LockIcon w={8} h={8} color="red.500" />
          )}
        </Text>
        {active === true ? (
          <Switch
            ml="3rem"
            size="lg"
            colorScheme="yellow"
            aria-checked={state === null ? "mixed" : undefined}
            isChecked={state === null ? undefined : state}
            isDisabled={state === null}
            onChange={onClickWrapped}
          />
        ) : null}
      </Box>
    ),
    [onClickWrapped, state, active]
  );
};

const CollateralView: React.FC<{ tokenAddress: string | undefined, canCollateral: boolean | undefined }> = ({
  tokenAddress,
  canCollateral
}) => {
  const { data: userReserveData } = useUserReserveData(tokenAddress);
  const reserveUsedAsCollateral = userReserveData?.usageAsCollateralEnabled;
  const {
    collateralModeMutation: { mutate, isLoading: mutationIsLoading },
  } = useCollateralModeMutation(tokenAddress);
  const toggleUseAssetAsCollateral = React.useCallback(() => {
    if (reserveUsedAsCollateral === undefined || mutationIsLoading) {
      return;
    }
    const shouldUseAsCollateral = !reserveUsedAsCollateral;
    mutate(shouldUseAsCollateral);
  }, [reserveUsedAsCollateral, mutate, mutationIsLoading]);

  return React.useMemo(
    () => (
      <Tooltip
        placement="top-end"
        bg="gray.700"
        label={
          mutationIsLoading || reserveUsedAsCollateral === undefined
            ? ""
            : reserveUsedAsCollateral && canCollateral
            ? "Disable use of this asset as collateral"
            : canCollateral
            ? "Can't be used as collateral"
            : "Enable use of this asset as collateral"
        }
        fontSize="2xl"
        openDelay={400}
      >
        {/* Fragment around ThreeStateSwitch avoids "Function components cannot be given refs" error */}
        <>
          <ThreeStateSwitch
            state={mutationIsLoading ? null : reserveUsedAsCollateral ?? null}
            active={canCollateral ?? null}
            onClick={toggleUseAssetAsCollateral}
          />
        </>
      </Tooltip>
    ),
    [canCollateral, reserveUsedAsCollateral, toggleUseAssetAsCollateral, mutationIsLoading]
  );
};

export const DashboardTable: React.FC<{
  mode: DashboardTableType;
  assets: AssetData[];
}> = ({ mode, assets }) => {
  const history = useHistory();
  const onActionClicked = React.useCallback(
    (route: String, asset: Readonly<AssetData>) => {
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
          history.push(
            `/repay/${asset.symbol}/${
              asset.borrowMode === 1 ? "stable" : "variable"
            }`
          );
        }
      }
    },
    [assets, mode, history]
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
        Cell: (({ row }) => (
          <BalanceView
            balanceBN={row.original.balance}
            tokenAddress={row.original.tokenAddress}
          />
        )) as Renderer<CellProps<AssetData, BigNumber>>,
      },
      {
        Header: mode === DashboardTableType.Borrow ? "APR" : "APY",
        accessor: row => row.backingReserve?.tokenAddress ?? row.tokenAddress,
        Cell: (({ value, row }) =>
          /* There's a difference between the deposit APY and the borrow APR.
             Lending rates are obviously higher than borrowing rates */
          mode === DashboardTableType.Borrow ? (
            <BorrowAPRView
              tokenAddress={value}
              isStable={row.original.borrowMode === 1}
            />
          ) : (
            <DepositAPYView tokenAddress={value} />
          )) as Renderer<CellProps<AssetData, string>>,
      },
      {
        Header: mode === DashboardTableType.Borrow ? "Mode" : "Collateral",
        accessor: row => row.backingReserve,
        Cell: (({ row }) =>
          mode === DashboardTableType.Deposit && row.original.backingReserve ? (
            <CollateralView
              tokenAddress={row.original.backingReserve?.tokenAddress}
              canCollateral={row.original.canCollateral}
            />
          ) : (
            <Text>{row.original.borrowMode === 1 ? "Stable" : "Variable"}</Text>
          )) as Renderer<CellProps<AssetData, string>>,
      },
      {
        Header: mode === DashboardTableType.Borrow ? "Actions" : "Actions",
        accessor: row => row.tokenAddress,
        Cell: (({ row }) => (
          <Box d="flex" flexDir="row" alignItems="center" justifyContent="end">
            {(mode === DashboardTableType.Borrow && row.original.canBorrow) ||
            (mode === DashboardTableType.Deposit && row.original.canDeposit) ? (
              <Button
                fontSize={{ base: fontSizes.md, md: fontSizes.lg }}
                bg="secondary.900"
                _hover={{ bg: "primary.50" }}
                mr="1rem"
                onClick={() => {
                  onActionClicked("Deposit-Borrow", {
                    symbol:
                      row.original.backingReserve?.symbol ??
                      row.original.symbol,
                    tokenAddress:
                      row.original.backingReserve?.tokenAddress ??
                      row.original.tokenAddress,
                    balance: row.original.balance,
                  });
                }}
              >
                {mode === DashboardTableType.Borrow &&
                row.original.canBorrow === true ? (
                  <ColoredText fontWeight="400">{"Borrow"}</ColoredText>
                ) : (
                  <ColoredText fontWeight="400">{"Deposit"}</ColoredText>
                )}
              </Button>
            ) : null}
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
                  balance: row.original.balance,
                  borrowMode: row.original.borrowMode,
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

  const renderer = React.useMemo<TableRenderer<AssetData>>(
    () => table =>
      (
        <BasicTableRenderer
          table={table}
          tableProps={{
            style: {
              borderSpacing: "0 1em",
              borderCollapse: "separate",
              float: "left",
              marginRight:
                mode === DashboardTableType.Deposit && isDesktop ? "2%" : "0%",
              width: isDesktop ? "49%" : "100%",
            },
          }}
          headProps={{
            fontSize: "lg",
            fontFamily: "inherit",
            color: "white",
            border: "0px solid ",
            maxWidth: "15rem",
            whiteSpace: "nowrap",
            textAlign: "center",
            _first: { textAlign: "start" },
          }}
          rowProps={{
            // rounded: { md: "lg" }, // "table-row" display mode can't do rounded corners
            bg: "primary.900",
            color: "white",
            whiteSpace: "nowrap",
            height: "55px",
          }}
          cellProps={{
            borderBottom: "none",
            border: "0px solid",
            minWidth: "10rem",
            maxWidth: "15rem",
            paddingInlineStart: "0.1rem",
            paddingInlineEnd: "0.1rem",
            textAlign: "center",
            _first: {
              borderLeftRadius: "10px",
              paddingInlineStart: "1rem",
              textAlign: "start",
            },
            _last: { borderRightRadius: "10px", paddingInlineEnd: "1rem" },
          }}
        />
      ),
    [mode, isDesktop]
  );

  return (
    <SortedHtmlTable columns={columns} data={assets}>
      {renderer}
    </SortedHtmlTable>
  );
};
