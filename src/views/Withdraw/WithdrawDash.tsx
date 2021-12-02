import {
  Box,
  HStack,
  Text,
  VStack,
  useMediaQuery,
  Flex,
  Grid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  Spinner,
} from "@chakra-ui/react";
import { bigNumberToString } from "../../utils/fixedPoint";
import React from "react";
import ColoredText from "../../components/ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";
import {
  NATIVE_TOKEN,
  ReserveOrNativeTokenDefinition,
  ReserveTokenDefinition,
} from "../../queries/allReserveTokens";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
// import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { BigNumber, constants } from "ethers";
import { useUserAccountData } from "../../queries/userAccountData";
import { useUserReserveAssetBalancesDaiWei } from "../../queries/userAssets";
// import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { useUserAssetBalance } from "../../queries/userAssets";
import { fontSizes, spacings, assetColor } from "../../utils/constants";
import { TokenIcon } from "../../utils/icons";
import { useWrappedNativeDefinition } from "../../queries/wrappedNativeAddress";
import { CollateralComposition } from "../../components/Chart/CollateralComposition";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";

type WithdrawDashProps = {
  token: ReserveOrNativeTokenDefinition;
};

export const WithdrawDash: React.FC<WithdrawDashProps> = ({ token }) => {
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
    [reserves, token.tokenAddress]
  );
  // const { data: reserveProtocolData } = useProtocolReserveData(
  //   reserve?.tokenAddress
  // );
  // const { data: reserveConfiguration } = useProtocolReserveConfiguration(
  //   reserve?.tokenAddress
  // );
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );
  const { data: allReservesData } = useUserReserveAssetBalancesDaiWei();
  // const { data: tokenBalance } = useUserAssetBalance(token.tokenAddress);
  const { data: aTokenBalance } = useUserAssetBalance(reserve?.aTokenAddress);
  const { data: assetPriceInDai } = useAssetPriceInDai(reserve?.tokenAddress);
  // const utilizationRate = utilizationData?.utilizationRate;
  // const liquidityAvailable = reserveProtocolData?.availableLiquidity;
  // const isCollateralized = reserveConfiguration?.usageAsCollateralEnabled;
  // const maximumLtv = reserveConfiguration?.ltv;
  const currentLtv = userAccountData?.currentLtv;
  // const variableDepositAPY = reserveProtocolData?.variableBorrowRate;
  const healthFactor = userAccountData?.healthFactor;

  const decimals = useDecimalCountForToken(reserve?.tokenAddress).data;

  const totalCollateralValue = React.useMemo(() => {
    return allReservesData?.reduce(
      (memo: BigNumber, next) =>
        next.daiWeiPriceTotal !== null ? memo.add(next.daiWeiPriceTotal) : memo,
      constants.Zero
    );
  }, [allReservesData]);

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
          mr={{ base: "0rem", md: "1rem" }}
          alignItems="center"
          justifyContent="flex-start"
        >
          <TokenIcon
            symbol={token.symbol}
            borderRadius="100%"
            backgroundColor="#eee"
            border="2px solid"
            borderColor="#9BEFD7"
          />
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
            {"$" +
              assetPriceInDai?.toUnsafeFloat().toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 4,
              }) ?? " "}
          </Text>
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
          alignItems={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
          flexDirection={{ base: "column", lg: "row" }}
        >
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} pr="1rem">
            Deposited
          </Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {bigNumberToString(aTokenBalance, 4, decimals)}
            </Text>
            {isSmallerThan400 ? null : " " + token.symbol}
          </Box>
        </Flex>
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems="center"
          justifyContent="flex-start"
          flexDirection="column"
        >
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              Health factor
            </Text>
          </HStack>
          <HStack pr={{ base: "0rem", md: "1rem" }} textAlign="center" w="100%">
            <ColoredText
              minW={{ base: "30px", md: "100%" }}
              fontSize={{ base: fontSizes.md, md: fontSizes.lg }}
            >
              {" "}
              {bigNumberToString(healthFactor)}
            </ColoredText>
          </HStack>
        </Flex>
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems="center"
          justifyContent="flex-start"
          flexDirection="column"
        >
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "Current LTV" : "Current LTV"}
            </Text>
          </HStack>
          <HStack pr={{ base: "0rem", md: "1rem" }} textAlign="center">
            <Text
              fontSize={{
                base: fontSizes.md,
                md: fontSizes.lg,
                lg: fontSizes.xl,
              }}
              fontWeight="bold"
              minW={{ base: "30px", md: "100%" }}
            >
              {currentLtv ? (
                (currentLtv.toUnsafeFloat() * 100).toLocaleString().slice(0, 6)
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
        </Flex>
        <CollateralComposition />
      </Flex>
    </VStack>
  );
};
