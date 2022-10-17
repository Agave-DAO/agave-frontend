import {
  Box,
  HStack,
  Stack,
  Text,
  VStack,
  useMediaQuery,
  Flex,
  Spinner,
} from "@chakra-ui/react";
import { bigNumberToString } from "../../utils/fixedPoint";
import React from "react";
import ColoredText from "../../components/ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";
import {
  isReserveTokenDefinition,
  NativeTokenDefinition,
  NATIVE_TOKEN,
  ReserveOrNativeTokenDefinition,
  ReserveTokenDefinition,
} from "../../queries/allReserveTokens";
import { useUserAccountData } from "../../queries/userAccountData";
import {
  useUserAssetBalance,
  useUserStableAndVariableDebtForAsset,
} from "../../queries/userAssets";
import { fontSizes, spacings } from "../../utils/constants";
import { CollateralComposition } from "../../components/Chart/CollateralComposition";
import { useWrappedNativeDefinition } from "../../queries/wrappedNativeAddress";
import {
  ExtendedReserveTokenDefinition,
  useAllReserveTokensWithData,
} from "../../queries/lendingReserveData";
import { BigNumber } from "ethers";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";

export type RepayDashProps = {
  token: Readonly<ReserveOrNativeTokenDefinition>;
  borrowMode: number;
};

type RepayDashReserveProps = {
  token: Readonly<ReserveTokenDefinition>;
  borrowMode: number;
};

type RepayDashNativeProps = {
  token: Readonly<NativeTokenDefinition>;
  borrowMode: number;
};

type RepayDashLayoutProps = {
  token: Readonly<ExtendedReserveTokenDefinition> | undefined;
  tokenBalance: BigNumber | undefined;
  native?: Readonly<NativeTokenDefinition>;
  borrowMode: number;
};

export const RepayDash: React.FC<RepayDashProps> = ({ token, borrowMode }) =>
  React.useMemo(
    () =>
      isReserveTokenDefinition(token) ? (
        <RepayDashReserve token={token} borrowMode={borrowMode} />
      ) : (
        <RepayDashNative token={token} borrowMode={borrowMode} />
      ),
    [token]
  );

const RepayDashReserve: React.FC<RepayDashReserveProps> = ({
  token,
  borrowMode,
}) => {
  const { data: reserves } = useAllReserveTokensWithData();
  const reserve = React.useMemo(
    () =>
      reserves?.find(reserve => reserve.tokenAddress === token.tokenAddress) ??
      reserves?.find(
        reserve =>
          reserve.tokenAddress.toLowerCase() ===
          token.tokenAddress?.toLowerCase()
      ),
    [reserves, token.tokenAddress]
  );
  const { data: tokenBalance } = useUserAssetBalance(reserve?.tokenAddress);
  return (
    <RepayDashLayout
      token={reserve}
      tokenBalance={tokenBalance}
      borrowMode={borrowMode}
    />
  );
};

const RepayDashNative: React.FC<RepayDashNativeProps> = ({
  token,
  borrowMode,
}) => {
  const { data: reserves } = useAllReserveTokensWithData();
  const { data: tokenBalance } = useUserAssetBalance(token);
  const { data: wrappedNative } = useWrappedNativeDefinition();
  const reserve = React.useMemo(
    () =>
      reserves?.find(
        reserve => reserve.tokenAddress === wrappedNative?.tokenAddress
      ) ??
      reserves?.find(
        reserve =>
          reserve.tokenAddress.toLowerCase() ===
          wrappedNative?.tokenAddress.toLowerCase()
      ),
    [reserves, wrappedNative?.tokenAddress]
  );
  return (
    <RepayDashLayout
      token={reserve}
      tokenBalance={tokenBalance}
      native={token}
      borrowMode={borrowMode}
    />
  );
};

export const RepayDashLayout: React.FC<RepayDashLayoutProps> = ({
  token,
  tokenBalance,
  native,
  borrowMode,
}) => {
  // General
  const { account: userAccountAddress } = useAppWeb3();
  // Debts
  const { data: debts } = useUserStableAndVariableDebtForAsset(
    token?.tokenAddress
  );
  const debt = borrowMode === 1 ? debts?.stableDebt : debts?.variableDebt;
  // User account data and balances
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );

  const symbol = native ? native.symbol : token?.symbol;

  // Debt position information
  const totalCollateral = userAccountData?.totalCollateralEth;
  const currentLtv = userAccountData?.currentLtv;
  const healthFactor = userAccountData?.healthFactor;

  const decimals = useDecimalCountForToken(token?.tokenAddress).data;

  const [isSmallerThan400, isSmallerThan900] = useMediaQuery([
    "(max-width: 400px)",
    "(max-width: 900px)",
  ]);

  return (
    <VStack spacing="0" w="100%" bg="primary.900" rounded="lg">
      <Flex
        justifyContent="space-between"
        alignItems="center"
        fontSize={{ base: fontSizes.md, md: fontSizes.md }}
        w="100%"
        borderBottom="3px solid"
        borderBottomColor="primary.50"
        py={{ base: "2rem", md: "2.4rem" }}
        px={{ base: "1rem", md: "2.4rem" }}
      >
        <Flex
          w="30%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} pr="1rem">
            You Borrowed
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {bigNumberToString(debt, 4, decimals)}
            </Text>
            {isSmallerThan400 ? null : " " + symbol}
          </Box>
        </Flex>
        <Flex
          w="30%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} pr="1rem">
            Wallet Balance
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {bigNumberToString(tokenBalance, 4, decimals)}
            </Text>
            {isSmallerThan400 ? null : " " + symbol}
          </Box>
        </Flex>
        <Flex
          w="30%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} pr="1rem">
            Borrow Mode
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {borrowMode === 1 ? "Stable" : "Variable"}
            </Text>
          </Box>
        </Flex>
        <Flex
          w="30%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              Health factor
            </Text>
          </HStack>
          <ColoredText fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            {bigNumberToString(healthFactor)}
          </ColoredText>
        </Flex>
      </Flex>
      <Flex
        w="100%"
        py={{ base: "2rem", md: "2.4rem" }}
        px={{ base: "1rem", md: "2.4rem" }}
        justifyContent="space-between"
      >
        {isSmallerThan400 ? null : (
          <Stack
            justifyContent="flex-start"
            mr={{ base: "0.7rem", md: "1rem" }}
          >
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "Collateral" : "Your collateral"}
            </Text>
            <HStack fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
              <Text
                fontSize={{
                  base: fontSizes.md,
                  md: fontSizes.lg,
                  lg: fontSizes.xl,
                }}
                fontWeight="bold"
              >
                $ {bigNumberToString(totalCollateral)}
              </Text>{" "}
              {symbol}
            </HStack>
          </Stack>
        )}

        <Stack
          justifyContent="flex-start"
          mr={{ base: "0.2rem", md: "1rem" }}
          whiteSpace="nowrap"
        >
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "LTV" : "Current LTV"}
            </Text>
          </HStack>
          <HStack pr={{ base: "0rem", md: "1rem" }} align="center">
            <Text
              fontSize={{
                base: fontSizes.md,
                md: fontSizes.lg,
                lg: fontSizes.xl,
              }}
              fontWeight="bold"
            >
              {currentLtv ? (
                (currentLtv.toUnsafeFloat() * 100).toLocaleString()
              ) : (
                <Spinner
                  speed="0.5s"
                  emptyColor="gray.200"
                  color="yellow.500"
                />
              )}{" "}
              %
            </Text>
          </HStack>
        </Stack>
        <CollateralComposition />
      </Flex>
    </VStack>
  );
};
