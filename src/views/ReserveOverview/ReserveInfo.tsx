import React from "react";
import APYCard from "./APYCards";
import StatCard from "./StatCard";
import MiddleCard from "./middleCards";

import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { useWrappedNativeAddress } from "../../queries/wrappedNativeAddress";
import { useTotalBorrowedForAsset } from "../../queries/totalBorrowedForAsset";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAvailableLiquidity } from "../../queries/availableLiquidity";
import { useAssetUtilizationRate } from "../../queries/assetUtilizationRate";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";

import { UnlockIcon, LockIcon } from "@chakra-ui/icons";
import {
  useMediaQuery,
  CircularProgress,
  CircularProgressLabel,
  Text,
  Flex,
  Container,
  Box,
  Center,
} from "@chakra-ui/react";

// conversions and helpers
import { round2Fixed } from "../../utils/helpers";
import { BigNumber, BigNumberish, constants, FixedNumber } from "ethers";
import { TokenIcon } from "../../utils/icons";

const ReserveInfo: React.FC<{ asset: ReserveTokenDefinition }> = ({
  asset,
}) => {
  // Query data
  const reserveConfig = useProtocolReserveConfiguration(
    asset.tokenAddress
  )?.data;
  const reserveData = useProtocolReserveData(asset.tokenAddress)?.data;
  const assetPrice = useAssetPriceInDai(asset.tokenAddress)?.data;
  const assetNative = useAssetPriceInDai(useWrappedNativeAddress()?.data)?.data;

  // TODO not sure why the following 3 calls calls returning undefined on rinkby still
  const availableLiquidity = useAvailableLiquidity(asset.tokenAddress)?.data;
  const totalBorrowedForAsset = useTotalBorrowedForAsset(
    asset.tokenAddress
  )?.data;
  const assetUtilization = useAssetUtilizationRate(asset.tokenAddress)?.data;

  // Check data for undefined and convert to usable front end data
  const decimals = reserveConfig ? reserveConfig?.decimals.toNumber() : 18;
  const price = assetPrice ? parseFloat(assetPrice?._value) : 0;
  const priceNative = assetNative ? parseFloat(assetNative?._value) : 0;

  const liquidity = availableLiquidity ? availableLiquidity : 0;
  const totalBorrowed = totalBorrowedForAsset ? totalBorrowedForAsset : 0;

  const liquidityPrice = liquidity
    ? round2Fixed(
        FixedNumber.fromValue(
          liquidity.mul(price).div(constants.WeiPerEther),
          decimals
        ).toString()
      )
    : 0;
  const liqudityNative = liquidity
    ? round2Fixed(
        FixedNumber.fromValue(
          liquidity.mul(priceNative).div(constants.WeiPerEther),
          decimals
        ).toString()
      )
    : 0;

  const totalBorrowedPrice = totalBorrowed ? totalBorrowed.dai : 0;
  const totalBorrowedNative = 0;

  // percetage between availible liquidity and total borrowed : floating point number between 1-100
  const graph = 0.2;

  // Utilization Cards TODO needs work
  const utilizationRate = assetUtilization ? assetUtilization : 0;
  const reserveSize = liquidity ? liquidity.mul(price) : 0;

  console.log(reserveData);

  // APY cards (Lendeing reserves) TODO
  // const depostApy;
  // const deposit30Day;
  // const depositOverTotal;

  // const stableApy;
  // const stable30Day;
  // const stableOverTotal;

  // const variableApy;
  // const variable30Day;
  // const variableOverTotal;

  // Bottom Stat Cards
  const ltv = reserveConfig?.ltv._value
    ? parseFloat(reserveConfig?.ltv._value) * 100
    : "~";
  const liqThrsh = reserveConfig?.liquidationThreshold._value
    ? `${reserveConfig?.liquidationThreshold._value.substring(27, 25)}%`
    : "0";
  const liqPen = reserveConfig?.liquidationBonus._value
    ? `${reserveConfig?.liquidationBonus._value.substring(27, 24)}%`
    : "0";
  const collateral = reserveConfig?.usageAsCollateralEnabled ? "Yes" : "No";
  const stable = reserveConfig?.stableBorrowRateEnabled ? "Yes" : "No";

  // Media Quieries
  const [isLargeTab] = useMediaQuery("(max-width: 1200px)");
  const [isSmallTab] = useMediaQuery("(max-width: 800px)");
  const [isLargePhone] = useMediaQuery("(max-width: 600px)");
  const [isMobile] = useMediaQuery("(max-width: 450px)");

  // Component Return
  return (
    <React.Fragment>
      <Flex
        display="flex"
        flex="1 1 0%"
        flexDirection="column"
        textColor="white"
        mr={{ base: "0px", lg: "20px" }}
        maxW="1200px"
      >
        <Text fontSize="xl" color="white" padding="1rem">
          Reserve Status & Configuration
        </Text>
        <Box>
          <Box
            maxW="100%"
            minW={{ base: "auto", xl: "100rem" }}
            bg="primary.900"
            p={isMobile ? "0px" : "20px"}
            flex="1 1 0%"
            borderRadius="15px"
            boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 3px 0px"
          >
            {/* 1/4 AssetGraph  */}
            <Container>
              <Flex padding="1rem" justifyContent="center">
                <Flex
                  flex="1 0 100%"
                  p="4"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Flex justifyContent="flex-end">
                    <UnlockIcon
                      w={4}
                      h={4}
                      color="green.200"
                      margin="0.25rem"
                    />
                    <Text fontSize="lg" color="white" align="right">
                      Available Liquidity
                    </Text>
                  </Flex>
                  <Text fontSize="3xl" color="white" align="right">
                    {liquidityPrice}
                  </Text>
                  <Box>
                    <Text fontSize="md" color="white" align="right">
                      $ {liqudityNative}
                    </Text>
                  </Box>
                </Flex>
                <Flex>
                  <CircularProgress
                    value={graph}
                    size="120px"
                    color="yellow.400"
                    trackColor="green.200"
                  >
                    <CircularProgressLabel>
                      <Center>
                        <TokenIcon symbol={asset.symbol} />
                      </Center>
                    </CircularProgressLabel>
                  </CircularProgress>
                </Flex>
                <Flex
                  flex="1 0 100%"
                  p="4"
                  flexDirection="column"
                  justifyContent="center"
                >
                  <Flex justifyContent="flex-start">
                    <Text fontSize="lg" color="white" align="left">
                      Total Borrowed
                    </Text>
                    <LockIcon w={4} h={4} color="yellow.400" margin="0.25rem" />
                  </Flex>
                  <Text fontSize="3xl" color="white" align="left">
                    {totalBorrowedPrice}
                  </Text>
                  <Box>
                    <Text fontSize="md" color="white" align="left">
                      $ {totalBorrowedNative}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
            </Container>

            <Container
              maxW="450px"
              mb={isMobile ? "0px" : isSmallTab ? "10px" : "20px"}
            >
              <Flex
                display={isLargePhone ? "block" : "flex"}
                justify="center"
                pl={isMobile ? "5px" : isLargePhone ? "1em" : ""}
              >
                {/* 2/4 utility cards */}
                <MiddleCard title="Reserve Size" value={reserveSize} />
                <MiddleCard title="Utilisation Rate" value={utilizationRate} />
              </Flex>
            </Container>
            <Center>
              <Box
                mb={isMobile ? "0px" : isSmallTab ? "10px" : "20px"}
                display={isMobile ? "block" : isLargePhone ? "block" : "flex"}
                justifyContent="center"
                alignItems="center"
              >
                {/* 3/4 Cards TODO Pass Real Values */}
                <APYCard
                  title="Deposit"
                  color="yellow"
                  apy=""
                  avg=""
                  total=""
                />
                {/* TODO Used for Stable coin borrowing, to be implemented when ready */}
                <APYCard
                  title="Stable Borrowing"
                  color="orenge"
                  apy=""
                  avg=""
                  total=""
                />
                <APYCard
                  title="Variable Borrowing"
                  color="green"
                  apy=""
                  avg=""
                  total=""
                />
              </Box>
            </Center>

            <Box
              m="0px auto"
              display={isMobile ? "block" : isLargeTab ? "flex" : "flex"}
              alignItems="flex-start"
              justifyContent="space-between"
              maxWidth="750px"
            >
              {/* 4/4 statCards  */}
              <StatCard title="Maximum LTV" value={ltv} type="%" />
              <StatCard title="Liquidity Threshold" value={liqThrsh} />
              <StatCard title="Liquidity Penalty" value={liqPen} />
              <StatCard
                title="Used As Collateral"
                color={collateral === "Yes" ? "green" : "orenge"}
                value={collateral}
              />
              <StatCard
                title="Stable Borrowing"
                color={stable === "Yes" ? "green" : "orenge"}
                value={stable}
              />
            </Box>
          </Box>
        </Box>
      </Flex>
    </React.Fragment>
  );
};

export default ReserveInfo;
