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
  const [isSmallerThan400] = useMediaQuery("(max-width: 400px)");

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
        <Flex w="30%" spacing={spacings.md} mr={{ base: "0rem", md: "1rem" }} alignItems={{base:"flex-start", lg:"center"}}  justifyContent="flex-start" flexDirection={{base:"column", lg:"row"}}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}  pr="1rem">My Deposits</Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>	
            <Text display="inline-block" fontWeight="bold" fontSize="inherit" >
              {aTokenBalance ? formatEther(aTokenBalance).slice(0,8) : 0}
            </Text>
			{ isSmallerThan400 ? null : 
			" " + token.symbol
			}
          </Box>
        </Flex>
        <Flex w="30%" spacing={spacings.md} mr={{ base: "0rem", md: "1rem" }} alignItems={{base:"flex-start", md:"center"}}  justifyContent="flex-start" flexDirection={{base:"column", lg:"row"}}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}  pr="1rem">Wallet Balance</Text>
          <Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
            <Text display="inline-block" fontWeight="bold" fontSize="inherit">
              {tokenBalance ? formatEther(tokenBalance).slice(0,8) : 0}
            </Text>
			{ isSmallerThan400 ? null : 
			" " + token.symbol
			}
          </Box>
        </Flex>
        <Flex w="30%" spacing={spacings.md} mr={{ base: "0rem", md: "1rem" }} alignItems={{base:"flex-start", md:"center"}}  justifyContent="slex-start" flexDirection={{base:"column", lg:"row"}}>
          <HStack pr={{ base: "0rem", md: "1rem" }}>
			  <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} >Health factor</Text>
			  <ModalIcon position="relative" top="0" right="0" onOpen={() => {}} />
		  </HStack>
          <ColoredText fontSize={{ base: fontSizes.md, md: fontSizes.lg  }}>{healthFactor?.toUnsafeFloat().toLocaleString() ?? "-"}</ColoredText>
        </Flex>
      </Flex>
      <Flex 
	  w="100%" 
	  py={{ base: "2rem", md: "2.4rem" }} 
	  px={{ base: "1rem", md: "2.4rem" }}  
	  justifyContent="space-between">
        <Stack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} >Utilization Rate</Text>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} fontWeight="bold">
            {utilizationRate ? (utilizationRate.toUnsafeFloat() * 100).toLocaleString() : "-"} %
          </Text>
        </Stack>
		{ isSmallerThan400 ? null : 
        <Stack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} >Available Liquidity</Text>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} fontWeight="bold">
            {liquidityAvailable ? formatEther(liquidityAvailable) : "-"}
            {" "}
            {token.symbol}
          </Text>
        </Stack>
		}	
        <Stack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} >Deposit APY</Text>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} fontWeight="bold">
            {variableDepositAPY ? (variableDepositAPY.toUnsafeFloat() * 100).toLocaleString() : "-"} %
          </Text>
        </Stack>
        <Stack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} >Collateralizable</Text>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} fontWeight="bold" color="yellow.100">
            {isCollateralized !== undefined ? (isCollateralized ? "Yes" : "No") : "-"}
          </Text>
        </Stack>
        <Stack justifyContent="flex-start" mr={{ base: "0.2rem", md: "1rem" }} whiteSpace="nowrap">
          <HStack pr={{ base: "0rem", md: "1rem" }}>
            <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>{
			isSmallerThan900 ? "Max LTV" : "Maximum LTV"
			}</Text>
          </HStack>
		  <HStack pr={{ base: "0rem", md: "1rem" }} align="center">
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} fontWeight="bold" >
            {maximumLtv ? (maximumLtv.toUnsafeFloat() * 100).toLocaleString() : "-"} %
          </Text>
		  <ModalIcon position="relative" top="0" right="0" onOpen={() => {}} />
		  </HStack>
        </Stack>
		{ isSmallerThan900 ? null : 
        <Stack justifyContent="flex-start" mr={{ base: "0.7rem", md: "1rem" }}>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} >Asset price</Text>
          <Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} fontWeight="bold">
            $ {assetPriceInDai?.toUnsafeFloat().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? "-"}
          </Text>
        </Stack>
		}
      </Flex>
    </VStack>
  );
};

export default DepositDash;
