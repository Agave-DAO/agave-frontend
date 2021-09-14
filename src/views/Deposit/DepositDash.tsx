import {
  Box,
  HStack,
  Stack,
  Text,
  VStack,
  useMediaQuery,
  Flex,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  bigNumberToString,
  fixedNumberToPercentage,
} from "../../utils/fixedPoint";
import ColoredText from "../../components/ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";
import {
  ReserveTokenDefinition,
  ReserveOrNativeTokenDefinition,
  isReserveTokenDefinition,
  NativeTokenDefinition,
} from "../../queries/allReserveTokens";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAssetUtilizationRate } from "../../queries/assetUtilizationRate";
import {
  useAllReserveTokensWithData,
  ExtendedReserveTokenDefinition,
} from "../../queries/lendingReserveData";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { useUserAccountData } from "../../queries/userAccountData";
import { useUserAssetBalance } from "../../queries/userAssets";
import { useWrappedNativeDefinition } from "../../queries/wrappedNativeAddress";
import { fontSizes, spacings } from "../../utils/constants";
import { ModalIcon, useNativeSymbols } from "../../utils/icons";
import ModalComponent, { MODAL_TYPES } from "../../components/Modals";
import { useDisclosure } from "@chakra-ui/hooks";
import { BigNumber } from "ethers";

export type DepositDashProps = {
  token: Readonly<ReserveOrNativeTokenDefinition>;
};

type DepositDashReserveProps = {
  token: Readonly<ReserveTokenDefinition>;
};

type DepositDashNativeProps = {
  token: Readonly<NativeTokenDefinition>;
};

type DepositDashLayoutProps = {
  reserve: Readonly<ExtendedReserveTokenDefinition> | undefined;
  tokenBalance: BigNumber | undefined;
};

export const DepositDash: React.FC<DepositDashProps> = ({ token }) =>
  React.useMemo(
    () =>
      isReserveTokenDefinition(token) ? (
        <DepositDashReserve token={token} />
      ) : (
        <DepositDashNative token={token} />
      ),
    [token]
  );

const DepositDashReserve: React.FC<DepositDashReserveProps> = ({ token }) => {
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
  return <DepositDashLayout reserve={reserve} tokenBalance={tokenBalance} />;
};

const DepositDashNative: React.FC<DepositDashNativeProps> = ({ token }) => {
  const { data: reserves } = useAllReserveTokensWithData();
  const { data: tokenBalance } = useUserAssetBalance(token);
  const { data: wnative } = useWrappedNativeDefinition();
  const nativeSymbols = useNativeSymbols();
  const reserve = React.useMemo(() => {
    const asset =
      reserves?.find(
        reserve => reserve.tokenAddress === wnative?.tokenAddress
      ) ??
      reserves?.find(
        reserve =>
          reserve.tokenAddress.toLowerCase() ===
          wnative?.tokenAddress.toLowerCase()
      );
    return asset && nativeSymbols.wrappednative === asset.symbol
      ? { ...asset, symbol: nativeSymbols.native }
      : asset;
  }, [reserves, wnative?.tokenAddress]);

  return <DepositDashLayout reserve={reserve} tokenBalance={tokenBalance} />;
};

const DepositDashLayout: React.FC<DepositDashLayoutProps> = ({
  reserve,
  tokenBalance,
}) => {
  const { account: userAccountAddress } = useAppWeb3();
  const { data: reserveProtocolData } = useProtocolReserveData(
    reserve?.tokenAddress
  );
  const { data: reserveConfiguration } = useProtocolReserveConfiguration(
    reserve?.tokenAddress
  );
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );
  const { data: aTokenBalance } = useUserAssetBalance(reserve?.aTokenAddress);
  const { data: utilizationData } = useAssetUtilizationRate(
    reserve?.tokenAddress
  );
  const { data: assetPriceInDai } = useAssetPriceInDai(reserve?.tokenAddress);
  const utilizationRate = utilizationData?.utilizationRate;
  const liquidityAvailable = reserveProtocolData?.availableLiquidity;
  const isCollateralized = reserveConfiguration?.usageAsCollateralEnabled;
  const maximumLtv = reserveConfiguration?.ltv;
  const variableDepositAPY = reserveProtocolData?.liquidityRate;
  const healthFactor = userAccountData?.healthFactor;

  const [isSmallerThan400, isSmallerThan900] = useMediaQuery([
    "(max-width: 400px)",
    "(max-width: 900px)",
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modal_type, setModal] = useState(MODAL_TYPES.MAXIMUM_LTV);

  const onSubmitMaxLTV = React.useCallback(() => {
    setModal(MODAL_TYPES.MAXIMUM_LTV);
    onOpen();
  }, [onOpen]);

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
            My Deposits
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {bigNumberToString(aTokenBalance)}
            </Text>
            {isSmallerThan400 ? null : " " + reserve?.symbol}
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
              {bigNumberToString(tokenBalance)}
            </Text>
            {isSmallerThan400 ? null : " " + reserve?.symbol}
          </Box>
        </Flex>
        <Flex
          w="30%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="slex-start"
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
        <Stack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
            {isSmallerThan900 ? "Utilization" : "Utilization Rate"}
          </Text>
          <Text
            fontSize={{
              base: fontSizes.md,
              md: fontSizes.lg,
              lg: fontSizes.xl,
            }}
            fontWeight="bold"
          >
            {utilizationRate
              ? (utilizationRate.toUnsafeFloat() * 100).toLocaleString()
              : "-"}{" "}
            %
          </Text>
        </Stack>
        {isSmallerThan400 ? null : (
          <Stack
            justifyContent="flex-start"
            mr={{ base: "0.7rem", md: "1rem" }}
          >
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "Liquidity" : "Available Liquidity"}
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
                {bigNumberToString(liquidityAvailable)}
              </Text>{" "}
              {reserve?.symbol}
            </HStack>
          </Stack>
        )}
        <Stack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
            {isSmallerThan900 ? "APY" : "Deposit APY"}
          </Text>
          <Text
            fontSize={{
              base: fontSizes.md,
              md: fontSizes.lg,
              lg: fontSizes.xl,
            }}
            fontWeight="bold"
          >
            {fixedNumberToPercentage(variableDepositAPY, 4, 2)}%
          </Text>
        </Stack>
        <Stack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
            Collateralizable
          </Text>
          <Text
            fontSize={{
              base: fontSizes.md,
              md: fontSizes.lg,
              lg: fontSizes.xl,
            }}
            fontWeight="bold"
            color="yellow.100"
          >
            {isCollateralized !== undefined
              ? isCollateralized
                ? "Yes"
                : "No"
              : "-"}
          </Text>
        </Stack>
        <Stack
          justifyContent="flex-start"
          mr={{ base: "0.2rem", md: "1rem" }}
          whiteSpace="nowrap"
        >
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "Max LTV" : "Maximum LTV"}
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
              {maximumLtv
                ? (maximumLtv.toUnsafeFloat() * 100).toLocaleString()
                : "-"}{" "}
              %
            </Text>
            <ModalIcon
              position="relative"
              top="0"
              right="0"
              onOpen={onSubmitMaxLTV}
            />
          </HStack>
        </Stack>
        {isSmallerThan900 ? null : (
          <Stack
            justifyContent="flex-start"
            mr={{ base: "0.7rem", md: "1rem" }}
          >
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              Asset price
            </Text>
            <Text
              fontSize={{
                base: fontSizes.md,
                md: fontSizes.lg,
                lg: fontSizes.xl,
              }}
              fontWeight="bold"
            >
              ${" "}
              {assetPriceInDai?.toUnsafeFloat().toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              }) ?? "-"}
            </Text>
          </Stack>
        )}
      </Flex>
      <ModalComponent isOpen={isOpen} mtype={modal_type} onClose={onClose} />
    </VStack>
  );
};
