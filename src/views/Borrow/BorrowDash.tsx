import {
  Box,
  HStack,
  Text,
  VStack,
  useMediaQuery,
  Flex,
} from "@chakra-ui/react";
import React from "react";
import ColoredText from "../../components/ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";
import {
  NATIVE_TOKEN,
  ReserveOrNativeTokenDefinition,
} from "../../queries/allReserveTokens";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAssetUtilizationRate } from "../../queries/assetUtilizationRate";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useUserAccountData } from "../../queries/userAccountData";
import {
  useProtocolReserveData,
  useUserReservesData,
} from "../../queries/protocolReserveData";
import { fontSizes, spacings } from "../../utils/constants";
import { TokenIcon } from "../../utils/icons";
import {
  bigNumberToString,
  fixedNumberToPercentage,
} from "../../utils/fixedPoint";
import { CollateralComposition } from "../../components/Chart/CollateralComposition";
import { useWrappedNativeDefinition } from "../../queries/wrappedNativeAddress";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";

type BorrowDashProps = {
  token: ReserveOrNativeTokenDefinition;
};

export const BorrowDash: React.FC<BorrowDashProps> = ({ token }) => {
  const { account: userAccountAddress } = useAppWeb3();
  const { data: reserves } = useAllReserveTokensWithData();
  const { data: wNative } = useWrappedNativeDefinition();
  const asset = token.tokenAddress === NATIVE_TOKEN ? wNative : token;
  const tokenAddresses = reserves?.map(asset => {
    return asset.tokenAddress;
  });
  const reserve = React.useMemo(
    () =>
      reserves?.find(reserve => reserve.tokenAddress === asset?.tokenAddress) ??
      reserves?.find(
        reserve =>
          reserve.tokenAddress.toLowerCase() ===
          asset?.tokenAddress.toLowerCase()
      ),
    [reserves, asset?.tokenAddress]
  );
  const { data: reserveProtocolData } = useProtocolReserveData(
    reserve?.tokenAddress
  );
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );
  // const { data: allUserReservesBalances } = useUserReserveAssetBalancesDaiWei();
  // const { data: tokenBalance } = useUserAssetBalance(token.tokenAddress);
  // const { data: aTokenBalance } = useUserAssetBalance(reserve?.aTokenAddress);
  const { data: utilizationData } = useAssetUtilizationRate(
    asset?.tokenAddress
  );
  const decimals = useDecimalCountForToken(asset?.tokenAddress).data;
  const { data: assetPriceInDai } = useAssetPriceInDai(reserve?.tokenAddress);
  const { data: allUserReservesData } = useUserReservesData(tokenAddresses);

  const utilizationRate = utilizationData?.utilizationRate;
  const liquidityAvailable = reserveProtocolData?.availableLiquidity;
  // const maximumLtv = reserveConfiguration?.ltv;
  // const currentLtv = userAccountData?.currentLtv;
  const variableBorrowAPR = reserveProtocolData?.variableBorrowRate;
  const healthFactor = userAccountData?.healthFactor;
  const totalCollateralEth = userAccountData?.totalCollateralEth;
  const userStableDebt = asset
    ? allUserReservesData?.[asset.tokenAddress]?.currentStableDebt
    : undefined;
  const userVariableDebt = asset
    ? allUserReservesData?.[asset.tokenAddress]?.currentVariableDebt
    : undefined;

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
        py={{ base: "1rem", md: "1rem" }}
        px={{ base: "1rem", md: "2.4rem" }}
      >
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
        >
          <TokenIcon
            symbol={token.symbol}
            borderRadius="100%"
            p="2px"
            background="whiteAlpha.500"
            border="2px solid"
            borderColor="whiteAlpha.600"
          />
          <Flex
            flexDirection={{ base: "column", lg: "row" }}
            justifyContent="flex-start"
            alignItems="center"
          >
            <ColoredText
              fontSize={{
                base: fontSizes.md,
                md: fontSizes.lg,
                lg: fontSizes.xl,
              }}
              mx="1.5rem"
            >
              {token.symbol}
            </ColoredText>
            <Text
              fontSize={{
                base: fontSizes.sm,
                md: fontSizes.md,
                lg: fontSizes.lg,
              }}
              fontWeight="bold"
            >
              {"$ " +
                assetPriceInDai?.toUnsafeFloat().toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 4,
                }) ?? " "}
            </Text>
          </Flex>
        </Flex>
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text
            fontSize={{ base: fontSizes.sm, md: fontSizes.md }}
            mr={{ base: "0rem", md: "1rem" }}
          >
            {isSmallerThan900 ? "Liquidity" : "Available Liquidity"}
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {bigNumberToString(liquidityAvailable, 2, decimals)}
            </Text>
          </Box>
        </Flex>
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text
            fontSize={{ base: fontSizes.sm, md: fontSizes.md }}
            mr={{ base: "0rem", md: "1rem" }}
          >
            {isSmallerThan900 ? "Utilization" : "Utilization Rate"}
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {fixedNumberToPercentage(utilizationRate, 2)}%
            </Text>
          </Box>
        </Flex>
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text
            fontSize={{ base: fontSizes.sm, md: fontSizes.md }}
            mr={{ base: "0rem", md: "1rem" }}
          >
            {isSmallerThan900 ? "Variable APR" : "Variable APR"}
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {fixedNumberToPercentage(variableBorrowAPR, 4, 2)}%
            </Text>
          </Box>
        </Flex>
      </Flex>
      <Flex
        w="100%"
        py={{ base: "2rem", md: "2.4rem" }}
        px={{ base: "1rem", md: "2.4rem" }}
        justifyContent="space-between"
      >
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="flex-start"
          flexDirection="column"
        >
          <Text
            fontSize={{ base: fontSizes.sm, md: fontSizes.md }}
            pr="1rem"
            mb="0.5em"
          >
            You Borrowed
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {bigNumberToString(
                userStableDebt
                  ? userVariableDebt?.add(userStableDebt)
                  : userVariableDebt,
                4,
                decimals
              )}
            </Text>
            {isSmallerThan400 ? null : " " + token.symbol}
          </Box>
        </Flex>
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="flex-start"
          flexDirection="column"
        >
          <HStack pr={{ base: "0rem", md: "1rem" }} mb="0.5em">
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              Health Factor
            </Text>
          </HStack>
          <HStack pr={{ base: "0rem", md: "1rem" }} textAlign="center" w="100%">
            <ColoredText
              minW={{ base: "30px", md: "100%" }}
              fontSize={{ base: fontSizes.md, md: fontSizes.lg }}
              fontWeight="bold"
            >
              {bigNumberToString(healthFactor)}
            </ColoredText>
          </HStack>
        </Flex>
        <Flex
          h="100%"
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems={{ base: "flex-start", md: "center" }}
          justifyContent="flex-start"
          flexDirection="column"
        >
          <HStack pr={{ base: "0rem", md: "1rem" }} mb="0.5em">
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              Your Collateral
            </Text>
          </HStack>
          <HStack pr={{ base: "0rem", md: "1rem" }} textAlign="center">
            <Text
              fontSize={{ base: fontSizes.md, md: fontSizes.lg }}
              fontWeight="bold"
              minW={{ base: "30px", md: "100%" }}
            >
              $ {bigNumberToString(totalCollateralEth)}
            </Text>
          </HStack>
        </Flex>

        {isSmallerThan900 ? null : <CollateralComposition />}
      </Flex>
    </VStack>
  );
};
