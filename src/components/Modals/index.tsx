import React, { useState } from "react";

import { fontSizes, spacings } from "../../utils/constants";

import {
  Text,
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
import { useDisclosure } from "@chakra-ui/hooks";

// ** conversions and helpers
import { round2Fixed } from "../../utils/helpers";
import { BigNumber, BigNumberish, constants, FixedNumber } from "ethers";
import { bigNumberToString } from "../../utils/fixedPoint";
import { TokenIcon } from "../../utils/icons";

export const MODAL_TYPES = {
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
