import { Box, HStack, Stack, Text, VStack, useMediaQuery, Flex } from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils";
import React from "react";
import ColoredText from "../../components/ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAssetUtilizationRate } from "../../queries/assetUtilizationRate";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { useUserAccountData } from "../../queries/userAccountData";
import { useUserAssetBalance } from "../../queries/userAssets";
import { fontSizes, spacings } from "../../utils/constants";
import { ModalIcon } from "../../utils/icons";

type DepositDashProps = {
  token: ReserveTokenDefinition;
};

const DepositDash: React.FC<DepositDashProps> = ({
  token,
}) => {
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
  const { data: reserveProtocolData } = useProtocolReserveData(reserve?.tokenAddress);
  const { data: reserveConfiguration } = useProtocolReserveConfiguration(reserve?.tokenAddress);
  const { data: userAccountData } = useUserAccountData(userAccountAddress ?? undefined);
  const { data: tokenBalance } = useUserAssetBalance(token.tokenAddress);
  const { data: aTokenBalance } = useUserAssetBalance(reserve?.aTokenAddress);
  const { data: utilizationData } = useAssetUtilizationRate(token.tokenAddress);
  const { data: assetPriceInDai } = useAssetPriceInDai(reserve?.tokenAddress);
  const utilizationRate = utilizationData?.utilizationRate;
  const liquidityAvailable = reserveProtocolData?.availableLiquidity;
  const isCollateralized = reserveConfiguration?.usageAsCollateralEnabled;
  const maximumLtv = reserveConfiguration?.ltv;
  const variableDepositAPY = reserveProtocolData?.variableBorrowRate;
  
  const healthFactor = userAccountData?.healthFactor;
  const [isSmallerThan900] = useMediaQuery("(max-width: 900px)");

  return (
    <VStack spacing="0" w="100%" bg="primary.900" rounded="lg">
      <Flex
	    justifyContent="space-between" 
		alignItems="center" 
		fontSize={{ base: fontSizes.md, md: "inherit" }} 
        w="100%"
        borderBottom="3px solid"
        borderBottomColor="primary.50"
        py="2.4rem"
        px="2.6rem"
      >
        <Flex w="30%" spacing={spacings.md} mr="1rem" alignItems={{base:"flex-start", md:"center"}}  justifyContent="flex-start" flexDirection={{base:"column", md:"row"}}>
          <Text fontSize={{ base: fontSizes.sm, md: "inherit" }}  pr="1rem">Your balance in Agave</Text>
          <Box >	
            <Text display="inline-block" fontWeight="bold" fontSize={{ base: fontSizes.sm, md: "inherit" }} >
              {aTokenBalance ? formatEther(aTokenBalance).slice(0,8) : 0}
			  {" "}
			  {token.symbol}
            </Text>
          </Box>
        </Flex>
        <Flex w="30%" spacing={spacings.md} mr="1rem" alignItems={{base:"flex-start", md:"center"}}   justifyContent="flex-start" flexDirection={{base:"column", md:"row"}}>
          <Text fontSize={{ base: fontSizes.sm, md: "inherit" }}  pr="1rem">Your wallet balance</Text>
          <Box>
            <Text display="inline-block" fontWeight="bold" fontSize={{ base: fontSizes.sm, md: "inherit" }} >
              {tokenBalance ? formatEther(tokenBalance).slice(0,8) : 0}
			  {" "}
              {token.symbol}
            </Text>
          </Box>
        </Flex>
        <Flex w="30%" spacing={spacings.md} mr="1rem" alignItems={{base:"flex-start", md:"center"}}   justifyContent="slex-start" flexDirection={{base:"column", md:"row"}}>
          <HStack pr="1rem">
			  <Text fontSize={{ base: fontSizes.sm, md: "inherit" }} >Health factor</Text>
          	  <ModalIcon position="relative" top="0" right="0" onOpen={() => {}} />
		  </HStack>
          <ColoredText fontSize={{ base: fontSizes.sm, md: "inherit" }} >{healthFactor?.toUnsafeFloat().toLocaleString() ?? "-"}</ColoredText>
        </Flex>
      </Flex>
      <HStack w="100%" py="2.4rem" px="2.6rem" justifyContent="space-between">
        <Stack justifyContent="flex-start">
          <Text fontSize={{ base: fontSizes.sm, md: "inherit" }} >Utilization Rate</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            {utilizationRate ? (utilizationRate.toUnsafeFloat() * 100).toLocaleString() : "-"} %
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize={{ base: fontSizes.sm, md: "inherit" }} >Available Liquidity</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            {liquidityAvailable ? formatEther(liquidityAvailable) : "-"}
            {" "}
            {token.symbol}
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize={{ base: fontSizes.sm, md: "inherit" }} >Deposit APY</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            {variableDepositAPY ? (variableDepositAPY.toUnsafeFloat() * 100).toLocaleString() : "-"} %
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <Text fontSize={{ base: fontSizes.sm, md: "inherit" }} >Usable as collateral</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold" color="yellow.100">
            {isCollateralized !== undefined ? (isCollateralized ? "Yes" : "No") : "-"}
          </Text>
        </Stack>
        <Stack justifyContent="flex-start">
          <HStack spacing="1rem">
            <Text fontSize={{ base: fontSizes.sm, md: "inherit" }} >Maximum LTV</Text>
            <ModalIcon
              position="relative"
              top="0"
              right="0"
              onOpen={() => {}}
            />
          </HStack>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            {maximumLtv ? (maximumLtv.toUnsafeFloat() * 100).toLocaleString() : "-"} %
          </Text>
        </Stack>
		{ isSmallerThan900 ? null : 
        <Stack justifyContent="flex-start">
          <Text fontSize={{ base: fontSizes.sm, md: "inherit" }} >Asset price</Text>
          <Text fontSize={fontSizes.xl} fontWeight="bold">
            $ {assetPriceInDai?.toUnsafeFloat().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? "-"}
          </Text>
        </Stack>
		}
      </HStack>
    </VStack>
  );
};

export default DepositDash;
