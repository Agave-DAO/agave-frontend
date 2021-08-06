import {
  Box,
  HStack,
  Stack,
  Text,
  VStack,
  useMediaQuery,
  Flex,
  tokenToCSSVar,
  Grid,
  GridItem,
  Popover,
  Button,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
} from "@chakra-ui/react";
import { bigNumberToString } from "../../utils/fixedPoint";
import React from "react";
import { ethers } from "ethers";
import ColoredText from "../../components/ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAssetUtilizationRate } from "../../queries/assetUtilizationRate";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { BigNumber, constants } from "ethers";
import { useUserDepositAssetBalances } from "../../queries/userAssets";
import { useUserAccountData } from "../../queries/userAccountData";
import { useUserReserveAssetBalancesDaiWei } from "../../queries/userAssets";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { useUserAssetBalance } from "../../queries/userAssets";
import { fontSizes, spacings, assetColor } from "../../utils/constants";
import { ModalIcon } from "../../utils/icons";
import { TokenIcon } from "../../utils/icons";

type WithdrawDashProps = {
  token: ReserveTokenDefinition;
};

export const WithdrawDash: React.FC<WithdrawDashProps> = ({ token }) => {
  const { account: userAccountAddress } = useAppWeb3();
  const { data: reserves } = useAllReserveTokensWithData();
  const reserve = React.useMemo(
    () =>
      reserves?.find(reserve => reserve.tokenAddress === token.tokenAddress) ??
      reserves?.find(
        reserve =>
          reserve.tokenAddress.toLowerCase() ===
          token.tokenAddress.toLowerCase()
      ),
    [reserves, token.tokenAddress]
  );
  const { data: reserveProtocolData } = useProtocolReserveData(
    reserve?.tokenAddress
  );
  const { data: reserveConfiguration } = useProtocolReserveConfiguration(
    reserve?.tokenAddress
  );
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );
  const { data: allReservesData } = useUserReserveAssetBalancesDaiWei();
  const { data: tokenBalance } = useUserAssetBalance(token.tokenAddress);
  const { data: aTokenBalance } = useUserAssetBalance(reserve?.aTokenAddress);
  const { data: utilizationData } = useAssetUtilizationRate(token.tokenAddress);
  const { data: assetPriceInDai } = useAssetPriceInDai(reserve?.tokenAddress);
  const utilizationRate = utilizationData?.utilizationRate;
  const liquidityAvailable = reserveProtocolData?.availableLiquidity;
  const isCollateralized = reserveConfiguration?.usageAsCollateralEnabled;
  const maximumLtv = reserveConfiguration?.ltv;
  const currentLtv = userAccountData?.currentLtv;
  const variableDepositAPY = reserveProtocolData?.variableBorrowRate;
  const healthFactor = userAccountData?.healthFactor;

  const totalCollateralValue = React.useMemo(() => {
    return allReservesData?.reduce(
      (memo: BigNumber, next) =>
        next.daiWeiPriceTotal !== null ? memo.add(next.daiWeiPriceTotal) : memo,
      constants.Zero
    );
  }, [allReservesData]);

  const collateralComposition = React.useMemo(() => {
    const compositionArray = allReservesData?.map(next => {
      if (
        next.daiWeiPriceTotal !== null &&
        next.decimals &&
        totalCollateralValue
      ) {
        const decimalPower = BigNumber.from(10).pow(next.decimals);
        return next.daiWeiPriceTotal
          .mul(decimalPower)
          .div(totalCollateralValue);
      } else return BigNumber.from(0);
    });
    return compositionArray
      ? compositionArray.map(share => {
          if (share.gt(0)) {
            return bigNumberToString(share.mul(100));
          } else return null;
        })
      : [];
  }, [allReservesData, totalCollateralValue]);

  const collateralData = collateralComposition.map((x, index) => {
    if (x !== null) return x.substr(0, x.indexOf(".") + 3);
  });

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
              {bigNumberToString(aTokenBalance)}
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
              {currentLtv
                ? (currentLtv.toUnsafeFloat() * 100)
                    .toLocaleString()
                    .slice(0, 6)
                : "-"}{" "}
              %
            </Text>
          </HStack>
        </Flex>
        <Flex
          spacing={spacings.md}
          mr={{ base: "0rem", md: "1rem" }}
          alignItems="center"
          justifyContent="flex-start"
          flexDirection="column"
        >
          <HStack px={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>
              {isSmallerThan900 ? "Collateral" : "Collateral Composition"}
            </Text>
          </HStack>
          <Popover trigger="hover">
            <PopoverTrigger>
              <Grid
                role="button"
                w="100%"
                templateColumns={
                  collateralData.filter(x => x !== null).join("% ") + "%"
                }
                h="2rem"
                borderRadius="8px"
                borderColor="#444"
                borderStyle="solid"
                borderWidth="3px"
                overflow="hidden"
              >
                {allReservesData?.map((token, index) => (
                  <Box
                    bg={assetColor[token.symbol]}
                    w="100%"
                    h="100%"
                    borderRadius="0"
                    _hover={{ bg: assetColor[token.symbol], boxShadow: "xl" }}
                    _active={{ bg: assetColor[token.symbol] }}
                    _focus={{ boxShadow: "xl" }}
                    d={collateralComposition[index] !== null ? "block" : "none"}
                  />
                ))}
              </Grid>
            </PopoverTrigger>
            <PopoverContent bg="primary.300" border="2px solid">
              <PopoverBody bg="gray.700">
                <VStack m="auto" py="2rem" w="90%">
                  {allReservesData?.map((token, index) =>
                    collateralComposition[index] !== null ? (
                      <Flex
                        id={index + token.symbol}
                        alignItems="center"
                        justifyContent="space-between"
                        w="100%"
                      >
                        <Box
                          bg={assetColor[token.symbol]}
                          boxSize="1em"
                          minW="1em"
                          minH="1em"
                          borderRadius="1em"
                        />
                        <Text ml="1em" width="50%">
                          {" "}
                          {token.symbol}
                        </Text>
                        <Text ml="1em"> {collateralData[index] + "%"}</Text>
                      </Flex>
                    ) : (
                      <Text></Text>
                    )
                  )}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Flex>
      </Flex>
    </VStack>
  );
};
