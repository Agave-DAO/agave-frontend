import React from "react";
import { fontSizes, spacings } from "../../utils/constants";

import {
  Text,
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  Button,
} from "@chakra-ui/react";

import { useUserAccountData } from "../../queries/userAccountData";
import { useAppWeb3 } from "../../hooks/appWeb3";

// ** conversions and helpers
import { fixedNumberToPercentage } from "../../utils/fixedPoint";

export const MODAL_TYPES = {
  APROXIMATE_BALANCE: "APROXIMATE_BALANCE",
  CURRENT_LTV: "CURRENT_LTV",
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
        <Text>
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
        <Text>
          When a liquidation occurs, liquidators repay part or all of the
          outstanding borrowed amount on behalf of the borrower.<br></br> In
          return, they can buy the collateral at a discount and keep the
          difference as a bonus!
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
        <Text>
          The health factor is the numeric representation of the safety of your
          deposited assets against the borrowed assets and its underlying value.
          The higher the value is, the safer the state of your funds are against
          a liquidation scenario.
        </Text>
        <Text mt={5}>
          If the health factor reaches 1, the liquidation of your deposits will
          be triggered, and a Health Factor below 1 can get liquidated.
        </Text>
        <Text mt={5}>
          For a HF=2, the collateral value vs borrow can reduce up to 50%.
        </Text>
      </ModalBody>
    </>
  );
};
const ModalMaxLTV: React.FC<{}> = () => {
  return (
    <>
      <ModalHeader fontSize="1.8rem" fontWeight="bold">
        Loan to Value (LTV) Ratio
      </ModalHeader>
      <ModalBody>
        <Text>
          The Maximum Loan-to-Value ratio represents the maximum borrowing power
          of a specific collateral. <br></br> For example, if a collateral has a
          LTV of 75%, the user can borrow up to 0.75 worth of ETH in the
          principal currency for every 1 ETH worth of collateral.
        </Text>
      </ModalBody>
    </>
  );
};

const ModalAPBalance: React.FC<{}> = () => {
  return (
    <>
      <ModalHeader fontSize="1.8rem" fontWeight="bold">
        Approximate Balance
      </ModalHeader>
      <ModalBody>
        <Text fontSize="1.4rem">
          Your aggregated balance shows the approximate value in USD of all the
          assets you have deposited. It fluctuates based on the evolution of
          prices.
        </Text>
        <Text mt={5} fontSize="1.4rem">
          Please note that if your deposits consist of stable-coins the
          approximate balance in USD could be slightly higher or lower than the
          stable-coin balance, due to fluctuations in the stable-coin peg.
        </Text>
      </ModalBody>
    </>
  );
};

const ModalLTV: React.FC<{
  currentLTV?: string;
  maximumLTV?: string;
  threshold?: string;
}> = ({ currentLTV, maximumLTV, threshold }) => {
  const { account: userAccountAddress } = useAppWeb3();
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );
  return (
    <>
      <ModalHeader fontSize="1.8rem" fontWeight="bold">
        Liquidation Overview
      </ModalHeader>
      <ModalBody>
        <Text fontSize="1.4rem">
          Details about your Loan to Value (LTV) ratio and liquidation.
        </Text>
        <Text fontSize="1.2rem" mt={5}>
          * Adjusted to the type of collateral deposited.
        </Text>
        <Box
          mt="2rem"
          py="1.5rem"
          px="1rem"
          border="solid"
          borderRadius="xl"
          borderWidth="0.5px"
        >
          <HStack pb="0.5rem" px="1em" justifyContent="space-between">
            <Text fontSize="1.4rem">Current LTV</Text>
            <Text fontSize="1.4rem">
              {fixedNumberToPercentage(userAccountData?.currentLtv) ?? "-"}
            </Text>
          </HStack>
          <HStack pb="0.5rem" px="1em" justifyContent="space-between">
            <Text fontSize="1.4rem">Maximum LTV</Text>
            <Text fontSize="1.4rem">
              {fixedNumberToPercentage(userAccountData?.maximumLtv) ?? "-"}
            </Text>
          </HStack>
          <HStack px="1em" justifyContent="space-between">
            <Text fontSize="1.4rem">Liquidation threshold</Text>
            <Text fontSize="1.4rem">
              {fixedNumberToPercentage(
                userAccountData?.currentLiquidationThreshold
              ) ?? "-"}
            </Text>
          </HStack>
        </Box>
      </ModalBody>
    </>
  );
};

const ModalComponent: React.FC<{
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
          rounded="2xl"
          position="fixed"
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
              minW={{ base: "80%", md: "70%", lg: "30vw" }}
              minH={{ base: "50%", md: "30vh" }}
            >
              {mtype === MODAL_TYPES.APROXIMATE_BALANCE && <ModalAPBalance />}
              {mtype === MODAL_TYPES.CURRENT_LTV && <ModalLTV />}
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
                  fontSize={{ base: "1.6rem", md: fontSizes.lg }}
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

export default ModalComponent;
