import React, { useState } from "react";
import APYCard from "./APYCards";
import StatCard from "./StatCard";
import MiddleCard from "./middleCards";
import {
  useDepositAPY,
  useStableBorrowAPR,
  useVariableBorrowAPR,
} from "../../queries/depositAPY";
import { useProtocolReserveConfiguration } from "../../queries/protocolAssetConfiguration";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { useTotalBorrowedForAsset } from "../../queries/totalBorrowedForAsset";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useAssetUtilizationRate } from "../../queries/assetUtilizationRate";
import { ReserveTokenDefinition } from "../../queries/allReserveTokens";
import { useDisclosure } from "@chakra-ui/hooks";
import ModalComponent, { MODAL_TYPES } from "../../components/Modals";

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
  Spinner,
} from "@chakra-ui/react";

// ** conversions and helpers
import { round2Fixed } from "../../utils/helpers";
import { bigNumberToString } from "../../utils/fixedPoint";
import { TokenIcon } from "../../utils/icons";
import { BigNumber } from "ethers";

const ReserveInfo: React.FC<{ asset: ReserveTokenDefinition }> = ({
  asset,
}) => {
  // ** Query data
  const reserveData = useProtocolReserveConfiguration(asset.tokenAddress)?.data;
  const reserveProtocolData = useProtocolReserveData(asset?.tokenAddress)?.data;
  const assetPrice = useAssetPriceInDai(asset.tokenAddress)?.data;
  const totalBorrowedForAsset = useTotalBorrowedForAsset(
    asset.tokenAddress
  )?.data;
  const assetUtilization = useAssetUtilizationRate(asset.tokenAddress)?.data;
  const depositAPR = useDepositAPY(asset.tokenAddress)?.data?._value;
  const stableBorrowAPR = useStableBorrowAPR(asset.tokenAddress)?.data?._value;
  const variableAPR = useVariableBorrowAPR(asset.tokenAddress)?.data?._value;

  // ** Check data for undefined and convert to usable front end data
  // const decimals = reserveData ? reserveData?.decimals.toNumber() : 18;
  const price = assetPrice ? parseFloat(assetPrice?._value) : 0;
  const liquidity = reserveProtocolData?.availableLiquidity;
  const liquidityPrice = liquidity
    ? round2Fixed(
        parseFloat(
          bigNumberToString(
            liquidity,
            reserveData?.decimals,
            reserveData?.decimals
          )
        ) * price
      )
    : "0";
  const liqudityNative = liquidity
    ? bigNumberToString(liquidity, 3, reserveData?.decimals)
    : "0";
  const totalBorrowedPrice = totalBorrowedForAsset?.dai?._value
    ? round2Fixed(totalBorrowedForAsset.dai._value)
    : "0";
  const totalBorrowedNative = totalBorrowedForAsset?.wei
    ? bigNumberToString(
        totalBorrowedForAsset.wei,
        3,
        totalBorrowedForAsset.assetDecimals
      )
    : "0";

  // ** percetage between availible liquidity and total borrowed : number between 1-100
  const totalMarket =
    liquidity && totalBorrowedForAsset
      ? totalBorrowedForAsset.wei.add(liquidity)
      : null;
  const graph =
    totalBorrowedForAsset && totalMarket
      ? (parseFloat(totalBorrowedForAsset.wei.toString()) * 100) /
        parseFloat(totalMarket.toString())
      : 0;
  const utilizationRate = assetUtilization?.utilizationRate
    ? `${round2Fixed(
        (
          assetUtilization.utilizationRate.toUnsafeFloat() * 100
        ).toLocaleString()
      )}%`
    : undefined;

  const reserveSize = totalBorrowedForAsset?.dai?._value
    ? `$ ${round2Fixed(
        parseFloat(bigNumberToString(liquidity)) * price +
          parseFloat(totalBorrowedForAsset.dai._value)
      )}`
    : "0";

  // ** APY cards
  const depostApy = depositAPR
    ? round2Fixed(parseFloat(depositAPR) * 100)
    : "0";
  // const deposit30Day;
  // const depositOverTotal;

  const stableApy = stableBorrowAPR
    ? round2Fixed(parseFloat(stableBorrowAPR) * 100)
    : "0";
  // const stable30Day;
  // const stableOverTotal;

  const variableApy = variableAPR
    ? round2Fixed(parseFloat(variableAPR) * 100)
    : "0";
  // const variable30Day;
  // const variableOverTotal;

  // ** Bottom Stat Cards
  const ltv = reserveData?.rawltv ? (
    reserveData?.rawltv.toNumber() / 100
  ) : (
    <Spinner speed="0.5s" emptyColor="gray.200" color="yellow.500" />
  );
  const liqThrsh = reserveData?.rawliquidationThreshold ? (
    reserveData?.rawliquidationThreshold.toNumber() / 100
  ) : (
    <Spinner speed="0.5s" emptyColor="gray.200" color="yellow.500" />
  );
  const resFactor = reserveData?.rawreserveFactor ? (
    reserveData?.rawreserveFactor.toNumber() / 100
  ) : (
    <Spinner speed="0.5s" emptyColor="gray.200" color="yellow.500" />
  );
  const liqPen = reserveData?.rawliquidationBonus ? (
    reserveData?.rawliquidationBonus.toNumber() / 100 - 100
  ) : (
    <Spinner speed="0.5s" emptyColor="gray.200" color="yellow.500" />
  );
  const collateral = reserveData?.usageAsCollateralEnabled 
    ? (ltv > 0) 
      ? "Yes" : "No"
    : "No";
  const stable = reserveData?.stableBorrowRateEnabled ? "Yes" : "No";

  // ** Media Quieries
  const [isLargeTab] = useMediaQuery("(max-width: 1200px)");
  const [isSmallTab] = useMediaQuery("(max-width: 800px)");
  const [isLargePhone] = useMediaQuery("(max-width: 600px)");
  const [isMobile] = useMediaQuery("(max-width: 450px)");

  const [modal_type, setModal] = useState(MODAL_TYPES.HEALTH_FACTOR);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const setModalOpen = React.useCallback(
    (selector: string) => {
      switch (selector) {
        case "Maximum LTV": {
          setModal(MODAL_TYPES.MAXIMUM_LTV);
          break;
        }
        case "Liquidity Threshold": {
          setModal(MODAL_TYPES.LIQUIDITY_THRESHOLD);
          //statements;
          break;
        }
        case "Liquidity Penalty": {
          setModal(MODAL_TYPES.LIQUIDITY_PENALTY);

          break;
        }
        default: {
          setModal(MODAL_TYPES.HEALTH_FACTOR);
          break;
        }
      }

      onOpen();
    },
    [onOpen]
  );

  // ** Component Return
  return (
    <React.Fragment>
      <Flex
        display="flex"
        flex="1 1 0%"
        flexDirection="column"
        textColor="white"
        minWidth="70%"
        pr={{ base: "auto", lg: "2rem" }}
        marginInlineEnd="0px"
        marginInlineStart="0px"
        overflowX={{ base: "hidden" }}
      >
        <Text fontSize="2xl" color="white" padding="1rem">
          Reserve Status & Configuration
        </Text>
        <Box>
          <Box
            maxW="100%"
            minW={{ base: "auto", lg: "auto " }}
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
                    <Text fontSize="xl" color="white" align="right">
                      Available Liquidity
                    </Text>
                  </Flex>
                  <Text fontSize="3xl" color="white" align="right">
                    $ {liquidityPrice}
                  </Text>
                  <Box>
                    <Text fontSize="lg" color="white" align="right">
                      {liqudityNative} {asset.symbol}
                    </Text>
                  </Box>
                </Flex>
                <Flex>
                  <CircularProgress
                    value={graph}
                    size="6em"
                    color="purple.400"
                    trackColor="green.200"
                    thickness="10px"
                  >
                    <CircularProgressLabel>
                      <Center>
                        <TokenIcon symbol={asset.symbol} height="100%" />
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
                    <Text fontSize="xl" color="white" align="left">
                      Total Borrowed
                    </Text>
                    <LockIcon w={4} h={4} color="yellow.400" margin="0.25rem" />
                  </Flex>
                  <Text fontSize="3xl" color="white" align="left">
                    $ {totalBorrowedPrice}
                  </Text>
                  <Box>
                    <Text fontSize="lg" color="white" align="left">
                      {totalBorrowedNative} {asset.symbol}
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
                display={isLargePhone ? "flex" : "flex"}
                // display={isLargePhone ? "block" : "flex"}
                flexDirection={isLargePhone ? "column" : "row"}
                justifyContent="center"
                alignItems="center"
                justify="center"
                // pl={isMobile ? "5px" : isLargePhone ? "1em" : ""}
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
                maxWidth="90%"
              >
                {/* 3/4 Cards TODO Pass Real Values */}
                <APYCard
                  title="Deposit"
                  color="green"
                  apy={depostApy}
                  avg=""
                  total=""
                />
                <APYCard
                  title="Stable Borrowing"
                  color="orange"
                  apy={stableApy}
                  avg=""
                  total=""
                />
                <APYCard
                  title="Variable Borrowing"
                  color="purple"
                  apy={variableApy}
                  avg=""
                  total=""
                />
              </Box>
            </Center>

            <Box
              m="0px auto"
              p="10px"
              display={isMobile ? "flex" : isLargeTab ? "flex" : "flex"}
              alignItems="flex-start"
              justifyContent="space-between"
              maxWidth="750px"
            >
              {/* 4/4 statCards  */}
              <StatCard
                title="Maximum LTV"
                value={ltv}
                type="%"
                enableModal={true}
                modalOpen={setModalOpen}
              />
              <StatCard
                title="Liquidity Threshold"
                value={liqThrsh}
                type="%"
                enableModal
                modalOpen={setModalOpen}
              />
              <StatCard
                title="Liquidity Penalty"
                value={liqPen}
                type="%"
                enableModal={true}
                modalOpen={setModalOpen}
              />
              <StatCard title="Reserve Factor" value={resFactor} type="%" />
              <StatCard
                title="Used As Collateral"
                color={collateral === "Yes" ? "green" : "orange"}
                value={collateral}
              />
              <StatCard
                title="Stable Borrowing"
                color={stable === "Yes" ? "green" : "orange"}
                value={stable}
              />
            </Box>
          </Box>
        </Box>
      </Flex>
      <ModalComponent isOpen={isOpen} mtype={modal_type} onClose={onClose} />
    </React.Fragment>
  );
};

export default ReserveInfo;
