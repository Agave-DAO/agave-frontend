import React from "react";
import APYCard from "./APYCards";
import StatCard from "./StatCard";
import MiddleCard from "./middleCards";

import { useAssetUtilizationRate } from "../../queries/assetUtilizationRate";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { useTotalBorrowedForAsset } from "../../queries/totalBorrowedForAsset";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAvailableLiquidity } from "../../queries/availableLiquidity";
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
// import { round2Fixed } from "../../utils/helpers";
// import { FixedFromRay } from "../../utils/fixedPoint";
// import { BigNumber, BigNumberish, constants, FixedNumber } from "ethers";
import { TokenIcon } from "../../utils/icons";

const ReserveInfo: React.FC<{ asset: ReserveTokenDefinition }> = ({
  asset,
}) => {
  // Query data
  const reserveData = useProtocolReserveConfiguration(asset.tokenAddress).data;
  const assetPrice = useAssetPriceInDai(asset.tokenAddress).data;
  const availableLiquidity = useAvailableLiquidity(asset.tokenAddress).data;
  const totalBorrowedForAsset = useTotalBorrowedForAsset(asset.tokenAddress);
  const assetUtilization = useAssetUtilizationRate(asset.tokenAddress).data;
  // console.log("");

  // PRICE TODO
  const price = assetPrice ? parseFloat(assetPrice?._value) : 0;
  const liquidity = 0;
  const totalBorrowed = totalBorrowedForAsset ? 0 : 0;

  // Multiply by price
  const liquidityPrice = liquidity;
  const totalBorrowedPrice = totalBorrowed;
  const graph = 0;

  // Utilization Cards TODO

  // APY cards (Lendeing reserves) TODO

  // Bottom Stat Cards
  const ltv = reserveData?.ltv._value
    ? parseFloat(reserveData?.ltv._value) * 100
    : "~";
  const liqThrsh = reserveData?.liquidationThreshold._value
    ? reserveData?.liquidationThreshold._value
    : "0"; // TODO
  const liqPen = reserveData?.liquidationBonus._value
    ? reserveData?.liquidationBonus._value
    : "0"; // TODO
  const collateral = reserveData?.usageAsCollateralEnabled ? "Yes" : "No";
  const stable = reserveData?.stableBorrowRateEnabled ? "Yes" : "No";

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
            {/* 1/3 TODO AssetGraph TODO Pass Real Values */}
            <Container>
              <Flex w="100%" justify="center" align="center" padding="1rem">
                <Box p="4">
                  <Center>
                    <UnlockIcon
                      w={4}
                      h={4}
                      color="green.200"
                      margin="0.25rem"
                    />
                    <Text fontSize="lg" color="white" align="right">
                      Available Liquidity
                    </Text>
                  </Center>
                  <Text fontSize="3xl" color="white" align="right">
                    {liquidity}
                  </Text>
                  <strong></strong>
                  <Box>
                    <Text fontSize="md" color="white" align="right">
                      $ {liquidityPrice}
                    </Text>
                  </Box>
                </Box>
                <Box>
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
                </Box>
                <Box p="5">
                  <Center>
                    <Text fontSize="lg" color="white" align="left">
                      Total Borrowed
                    </Text>
                    <LockIcon w={4} h={4} color="yellow.400" margin="0.25rem" />
                  </Center>
                  <Text fontSize="3xl" color="white" align="left">
                    {totalBorrowed}
                  </Text>
                  <Box>
                    <Text fontSize="md" color="white" align="left">
                      $ {totalBorrowedPrice}
                    </Text>
                  </Box>
                </Box>
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
                {/* 2/3 Reserve Tiles TODO Pass Real Values*/}
                <MiddleCard title="Reserve Size" value="1242421" />
                <MiddleCard title="Utilisation Rate" value="1242421" />
              </Flex>
            </Container>
            <Center>
              <Box
                mb={isMobile ? "0px" : isSmallTab ? "10px" : "20px"}
                display={isMobile ? "block" : isLargePhone ? "block" : "flex"}
                justifyContent="center"
                alignItems="center"
              >
                {/* 3/3 Cards TODO Pass Real Values */}
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
