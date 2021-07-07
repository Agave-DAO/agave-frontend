import { Box, HStack, Stack, Text, VStack, useMediaQuery, Flex, tokenToCSSVar } from "@chakra-ui/react";
import { formatEther } from "ethers/lib/utils";
import React from "react";
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
import { fontSizes, spacings } from "../../utils/constants";
import { ModalIcon } from "../../utils/icons";
import { TokenIcon } from "../../utils/icons";

type WithdrawDashProps = {
	token: ReserveTokenDefinition;
};

const WithdrawDash: React.FC<WithdrawDashProps> = ({
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
	}, [allReservesData])

	const collateralComposition = React.useMemo(() => {
		return allReservesData?.map(next => {
			if (next.daiWeiPriceTotal != undefined && next.decimals != undefined && totalCollateralValue != undefined ) {
				 let decimals = BigNumber.from(10).pow(next.decimals);
				 return next.daiWeiPriceTotal.mul(decimals).div(totalCollateralValue) 
				}
			else  return 0;
		})
	}, [allReservesData, totalCollateralValue]);	

	
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
				py={{ base: "1rem", md: "1rem" }}
				px={{ base: "1rem", md: "2.4rem" }}
			>
				<Flex mr={{ base: "0rem", md: "1rem" }} alignItems="center" justifyContent="flex-start">
					<TokenIcon symbol={token.symbol} borderRadius="100%" backgroundColor="#eee" border="2px solid" borderColor="#9BEFD7" />
					<ColoredText fontSize={{ base: fontSizes.md, md: fontSizes.lg, lg: fontSizes.xl }} mx="1.5rem" >{token.symbol}</ColoredText>
					<Text fontSize={{ base: fontSizes.sm, md: fontSizes.md, lg: fontSizes.lg }} fontWeight="bold">
						{"$" + assetPriceInDai?.toUnsafeFloat().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 }) ?? " "}
					</Text>
				</Flex>
			</Flex>
			<Flex
				w="100%"
				py={{ base: "2rem", md: "2.4rem" }}
				px={{ base: "1rem", md: "2.4rem" }}
				justifyContent="space-between">

				<Flex spacing={spacings.md} mr={{ base: "0rem", md: "1rem" }} alignItems={{ base: "flex-start", lg: "center" }} justifyContent="flex-start" flexDirection={{ base: "column", lg: "row" }}>
					<Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} pr="1rem">Deposited</Text>
					<Box fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>
						<Text display="inline-block" fontWeight="bold" fontSize="inherit" >
							{aTokenBalance ? formatEther(aTokenBalance).slice(0, 8) : 0} {" $$$ "}
						</Text>
						{isSmallerThan400 ? null :
							" " + token.symbol
						}
					</Box>
				</Flex>
				<Flex spacing={spacings.md} mr={{ base: "0rem", md: "1rem" }} alignItems="center" justifyContent="flex-start" flexDirection="column">
					<HStack pr={{ base: "0rem", md: "1rem" }}>
						<Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }} >Health factor</Text>
					</HStack>
					<HStack pr={{ base: "0rem", md: "1rem" }} align="center">
						<ColoredText fontSize={{ base: fontSizes.md, md: fontSizes.lg }}>{healthFactor?.toUnsafeFloat().toLocaleString() ?? "-"}</ColoredText>
						<ModalIcon position="relative" top="0" right="0" onOpen={() => { }} />
					</HStack>
				</Flex>
				<Flex spacing={spacings.md} mr={{ base: "0rem", md: "1rem" }} alignItems="center" justifyContent="flex-start" flexDirection="column">
					<HStack pr={{ base: "0rem", md: "1rem" }}>
						<Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>{isSmallerThan900 ? "Current LTV" : "Current LTV"}</Text>
					</HStack>
					<HStack pr={{ base: "0rem", md: "1rem" }} align="center">
						<Text fontSize={{ base: fontSizes.md, md: fontSizes.lg, lg: fontSizes.xl }} fontWeight="bold" >
							{currentLtv ? (currentLtv.toUnsafeFloat() * 100).toLocaleString().slice(0, 6) : "-"} %
						</Text>
						<ModalIcon position="relative" top="0" right="0" onOpen={() => { }} />
					</HStack>
				</Flex>
				<Flex spacing={spacings.md} mr={{ base: "0rem", md: "1rem" }} alignItems="center" justifyContent="flex-start" flexDirection="column">
					<HStack pr={{ base: "0rem", md: "1rem" }}>
						<Text fontSize={{ base: fontSizes.sm, md: fontSizes.md }}>{isSmallerThan900 ? "Collateral" : "Collateral Composition"}</Text>
					</HStack>
					<HStack pr={{ base: "0rem", md: "1rem" }} align="center">
						// add the Collateral Composition stacked chart {collateralComposition?.toLocaleString()}
					</HStack>
				</Flex>
			</Flex>
		</VStack>
	);
};

export default WithdrawDash;
