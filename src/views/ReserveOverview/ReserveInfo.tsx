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
import { fontSizes, spacings } from "../../utils/constants";

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
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  Button,
} from "@chakra-ui/react";

// ** conversions and helpers
import { round2Fixed } from "../../utils/helpers";
import { BigNumber, BigNumberish, constants, FixedNumber } from "ethers";
import { bigNumberToString } from "../../utils/fixedPoint";
import { TokenIcon } from "../../utils/icons";

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
  const decimals = reserveData ? reserveData?.decimals.toNumber() : 18;
  const price = assetPrice ? parseFloat(assetPrice?._value) : 0;
  const liquidity = reserveProtocolData?.availableLiquidity;
  const liquidityPrice = liquidity
    ? round2Fixed(parseFloat(bigNumberToString(liquidity)) * price)
    : "0";
  const liqudityNative = liquidity
    ? round2Fixed(parseFloat(bigNumberToString(liquidity)))
    : "0";
  const totalBorrowedPrice = totalBorrowedForAsset?.dai?._value
    ? round2Fixed(totalBorrowedForAsset.dai._value)
    : "0";
  const totalBorrowedNative = totalBorrowedForAsset?.wei
    ? bigNumberToString(totalBorrowedForAsset.wei)
    : "0";

  // ** percetage between availible liquidity and total borrowed : number between 1-100
  const graph = totalBorrowedForAsset?.wei
    ? (parseFloat(totalBorrowedNative) /
        (parseFloat(totalBorrowedNative) +
          parseFloat(bigNumberToString(liquidity)))) *
      100
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
  const ltv = reserveData?.rawltv ? reserveData?.rawltv.toNumber() / 100 : "-";
  const liqThrsh = reserveData?.rawliquidationThreshold
    ? reserveData?.rawliquidationThreshold.toNumber() / 100
    : "-";
  const liqPen = reserveData?.rawliquidationBonus
    ? reserveData?.rawliquidationBonus.toNumber() / 100 - 100
    : "-";
  const collateral = reserveData?.usageAsCollateralEnabled ? "Yes" : "No";
  const stable = reserveData?.stableBorrowRateEnabled ? "Yes" : "No";

  const [modal_type, setModal] = useState(MODAL_TYPES.HEALTH_FACTOR);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const setModalOpen = React.useCallback(
    (selector: string) => {
      console.log(selector);
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

  // ** Media Quieries
  const [isLargeTab] = useMediaQuery("(max-width: 1200px)");
  const [isSmallTab] = useMediaQuery("(max-width: 800px)");
  const [isLargePhone] = useMediaQuery("(max-width: 600px)");
  const [isMobile] = useMediaQuery("(max-width: 450px)");

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
                enableModal={true}
                modalOpen={setModalOpen}
              />
              <StatCard
                title="Liquidity Penalty"
                value={liqPen}
                type="%"
                enableModal={true}
                modalOpen={setModalOpen}
              />
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

const MODAL_TYPES = {
  MAXIMUM_LTV: "MAXIMUM_LTV",
  HEALTH_FACTOR: "HEALTH_FACTOR",
  LIQUIDITY_PENALTY: "LIQUIDITY_PENALTY",
  LIQUIDITY_THRESHOLD: "LIQUIDITY_THRESHOLD",
};

const ModalLiqThreshold: React.FC<{}> = () => {
  return (
    <>
      <ModalHeader fontSize="1.8rem" fontWeight="bold">
        Liquidation Threshold
      </ModalHeader>
      <ModalBody>
        <Text fontSize="fontsizes.lg">
          This represents the threshold at which a borrow position will be
          considered undercollateralized and subject to liquidation for each
          collateral. <br></br>For example, if a collateral has a liquidation
          threshold of 80%, it means that the loan will be liquidated when the
          debt value is worth 80% of the collateral value.
        </Text>
      </ModalBody>
    </>
  );
};

const ModalLiqPenalty: React.FC<{}> = () => {
  return (
    <>
      <ModalHeader fontSize="1.8rem" fontWeight="bold">
        Liquidation Penalty
      </ModalHeader>
      <ModalBody>
        <Text fontSize="fontsizes.lg">
          When a liquidation occurs, liquidators repay part or all of the
          outstanding borrowed amount on behalf of the borrower. In return, they
          can buy the collateral at a discount and keep the difference as a
          bonus!
        </Text>
      </ModalBody>
    </>
  );
};

const ModalHFactor: React.FC<{}> = () => {
  return (
    <>
      <ModalHeader fontSize="1.8rem" fontWeight="bold">
        Health Factor
      </ModalHeader>
      <ModalBody>
        <Text fontSize="1.4rem">
          The health factor is the numeric representation of the safety of your
          deposited assets against the borrowed assets and its underlying value.
          The higher the value is, the safer the state of your funds are against
          a liquidation scenario.
        </Text>
        <Text mt={5} fontSize="1.4rem">
          If the health factor reaches 1, the liquidation of your deposits will
          be triggered, and a Health Factor below 1 can get liquidated.
        </Text>
        <Text mt={5} fontSize="1.4rem">
          For a HF=2, the collateral value vs borrow can reduce up to 50%.
        </Text>
      </ModalBody>
    </>
  );
};
const ModalMaxLTV: React.FC<{
  currentLTV?: string;
  maximumLTV?: string;
  threshold?: string;
}> = ({ currentLTV, maximumLTV, threshold }) => {
  return (
    <>
      <ModalHeader fontSize="1.8rem" fontWeight="bold">
        Loan to Value (LTV) Ratio
      </ModalHeader>
      <ModalBody>
        <Text fontSize="fontsize.lg">
          The Maximum Loan-to-Value ratio represents the maximum borrowing power
          of a specific collateral. <br></br> For example, if a collateral has a
          LTV of 75%, the user can borrow up to 0.75 worth of ETH in the
          principal currency for every 1 ETH worth of collateral.
        </Text>
      </ModalBody>
    </>
  );
};

export const ModalComponent: React.FC<{
  isOpen: boolean;
  mtype: string;
  onClose(): void;
}> = ({ children: modalChildren, mtype, isOpen, onClose }) => {
  return (
    <>
      {isOpen ? (
        <Box
          w="100%"
          justifyContent="space-between"
          px={{ base: "1.1rem", md: "2.2rem" }}
          py={{ base: spacings.md, md: "1.9rem" }}
          bg="secondary.900"
          rounded="2xl"
          position="relative"
          minH="14.4rem"
          minW="40%"
          m="0.5em"
          align="center"
        >
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
              color="primary.900"
              background="linear-gradient(#F3FFF7, #DCFFF1)"
              px={{ base: "1.5rem", md: "2.9rem" }}
              py="3.5rem"
              rounded="lg"
              minW={{ base: "80%", md: "30vw" }}
              minH={{ base: "50%", md: "30vh" }}
            >
              {mtype === MODAL_TYPES.MAXIMUM_LTV && <ModalMaxLTV />}
              {mtype === MODAL_TYPES.HEALTH_FACTOR && <ModalHFactor />}
              {mtype === MODAL_TYPES.LIQUIDITY_PENALTY && <ModalLiqPenalty />}
              {mtype === MODAL_TYPES.LIQUIDITY_THRESHOLD && (
                <ModalLiqThreshold />
              )}
              <ModalFooter>
                <Button
                  w={{ base: "100%", md: "60%" }}
                  m="auto"
                  mt={5}
                  py="1.5rem"
                  fontSize={{ base: "1.6rem", md: fontSizes.md }}
                  bg="secondary.100"
                  color="white"
                  fontWeight="normal"
                  onClick={onClose}
                >
                  Ok, I got it
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
      ) : null}
    </>
  );
};

export default ReserveInfo;
