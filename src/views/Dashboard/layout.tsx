import React, { useState } from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalContent,
  StackDivider,
  Text,
  VStack,
  ModalBody,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import { bigNumberToString } from "../../utils/fixedPoint"
import { fontSizes, spacings } from "../../utils/constants";
import { CenterProps, HStack } from "@chakra-ui/layout";
import { isMobileOnly } from "react-device-detect";
import { ModalIcon } from "../../utils/icons";
import { DashboardTable, DashboardTableType } from "./table";
import { DashboardEmptyState } from "./emptyState";
import { useHistory } from "react-router-dom";
import { AssetData } from ".";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { BigNumber, constants } from "ethers";

interface DashboardProps {
  borrowed: BigNumber | undefined;
  borrows: AssetData[] | undefined;
  collateral: BigNumber | undefined;
  deposits: AssetData[];
  healthFactor: BigNumber | undefined;
}

const MODAL_TYPES = {
  APROXIMATE_BALANCE: "APROXIMATE_BALANCE",
  HEALTH_FACTOR: "HEALTH_FACTOR",
};

export const DashboardBanner: React.FC<{}> = () => {
  return (
    <Box w="100%">
      {!isMobileOnly && (
        <Center width="100%" justifyContent="space-between">
          <Text
            fontWeight="bold"
            color="white"
            fontSize={{ base: "1.8rem", md: "2.4rem" }}
          >
            Dashboard
          </Text>
        </Center>
      )}
    </Box>
  );
};

const UpperBox: React.FC<{ title: string } & CenterProps> = ({
  title,
  children,
  ...props
}) => {
  return (
    <Center
      boxSizing="content-box"
      flexDirection="column"
      rounded="xl"
      minH="10.6rem"
      minW={{ base: "100%", lg: "auto" }}
      flex={1}
      bg="primary.900"
      py="1rem"
      {...props}
    >
      <VStack
        divider={
          <StackDivider
            borderColor="#36CFA2"
            h="0.188rem"
            backgroundColor="#36CFA2"
          />
        }
        spacing={4}
        w="100%"
        align="stretch"
        flexDirection="column"
      >
        <Text px={{ base: "2rem", md: "3rem" }} h="25">
          {title}
        </Text>
        <Box px={{ base: "2rem", md: "3rem" }}>{children}</Box>
      </VStack>
    </Center>
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

const ModalHFactor: React.FC<{
  currentLTV?: string;
  maximumLTV?: string;
  threshold?: string;
}> = ({ currentLTV, maximumLTV, threshold }) => {
  return (
    <>
      <ModalHeader fontSize="1.8rem" fontWeight="bold">
        Liquidation Overview
      </ModalHeader>
      <ModalBody>
        <Text fontSize="1.4rem">
          Details about your Loan to Value (LTV) ratio and liquidation.
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
            <Text fontSize="1.4rem">Current TVL</Text>
            <Text fontSize="1.4rem">{currentLTV ?? "-"}</Text>
          </HStack>
          <HStack pb="0.5rem" px="1em" justifyContent="space-between">
            <Text fontSize="1.4rem">Maximum LTV</Text>
            <Text fontSize="1.4rem">{maximumLTV ?? "-"}</Text>
          </HStack>
          <HStack px="1em" justifyContent="space-between">
            <Text fontSize="1.4rem">Liquidation threshold</Text>
            <Text fontSize="1.4rem">{threshold ?? "-"}</Text>
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
              {mtype === MODAL_TYPES.APROXIMATE_BALANCE && <ModalAPBalance />}
              {mtype === MODAL_TYPES.HEALTH_FACTOR && <ModalHFactor />}
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

const DashboardApproximateBalanceDisplay: React.FC<{}> = () => {
  const balancesDaiWei = useUserDepositAssetBalancesDaiWei();
  const daiDecimals = 18; // TODO: get this dynamically
  const balance = React.useMemo(() => {
    return balancesDaiWei.data?.reduce(
      (memo: BigNumber, next) =>
        next.daiWeiPriceTotal !== null ? memo.add(next.daiWeiPriceTotal) : memo,
      constants.Zero
    );
  }, [balancesDaiWei]);

  return <>$ {bigNumberToString(balance)}</>;
};

export const DashboardLayout: React.FC<DashboardProps> = ({
  deposits,
  borrows,
  borrowed,
  collateral,
  healthFactor,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modal_type, setModal] = useState(MODAL_TYPES.APROXIMATE_BALANCE);
  const history = useHistory();

  const onSubmitAP = React.useCallback(() => {
    setModal(MODAL_TYPES.APROXIMATE_BALANCE);
    onOpen();
  }, [onOpen]);

  const onSubmitHF = React.useCallback(() => {
    setModal(MODAL_TYPES.HEALTH_FACTOR);
    onOpen();
  }, [onOpen]);

  const depositsTable = React.useMemo(
    () =>
      deposits?.length > 0 ? (
        <DashboardTable assets={deposits} mode={DashboardTableType.Deposit} />
      ) : (
        <DashboardEmptyState
          onClick={() => {
            history.push("/deposit");
          }}
          type="Deposit"
        />
      ),
    [deposits, history]
  );

  const borrowsTable = React.useMemo(
    () =>
      borrows && borrows.length > 0 ? (
        <DashboardTable assets={borrows} mode={DashboardTableType.Borrow} />
      ) : (
        <DashboardEmptyState
          onClick={() => {
            history.push("/borrow");
          }}
          type="Borrow"
        />
      ),
    [borrows, history]
  );

  return (
    <Flex flexDirection="column">
      <Flex
        align="center"
        flexBasis="auto"
        spacing="1em"
        w="100%"
        flexDirection={{ base: "column", lg: "row" }}
        m="auto"
        color="white"
      >
        <UpperBox
          title="Deposit Information"
          mr={{ base: "inherit", lg: "2rem" }}
        >
          <VStack flexDirection="column" h="7.5rem" alignItems="baseline">
            <HStack d="flex" mt="0.5rem">
              <Text>Approximate Balance</Text>
              <ModalIcon
                position="relative"
                top="0"
                right="0"
                ml="0.5rem"
                transform="scale(0.75)"
                onOpen={onSubmitAP}
              />
            </HStack>
            {bigNumberToString(healthFactor)}
            <Text fontWeight="bold" textAlign="left" mt="0.5em" >
              <DashboardApproximateBalanceDisplay />
            </Text>
          </VStack>
        </UpperBox>
        <UpperBox
          title="Borrow Information"
          mt={{ base: "2rem", lg: "inherit" }}
        >
          <Box
            d="flex"
            flexDirection="row"
            justifyContent="space-between"
            pr="6rem"
            h="7.5rem"
          >
            <Box h="7rem" mt="0.5rem">
              <Text>Borrowed</Text>
              <Text fontWeight="bold" textAlign="left" mt="0.5em" whiteSpace="nowrap">
                {borrowed
                  ? `$ ${bigNumberToString(borrowed)}`
                  : "-"}
              </Text>
            </Box>
            <Box h="7rem" mt="0.5rem" ml="4rem">
              <Text>Collateral</Text>
              <Text fontWeight="bold" textAlign="left" mt="0.5em" whiteSpace="nowrap">
                {collateral
                  ? `$ ${bigNumberToString(collateral)}`
                  : "-"}
              </Text>
            </Box>
            <VStack
              flexDirection="column"
              h="7rem"
              alignItems="baseline"
              ml="4rem"
            >
              <HStack d="flex" mt="0.5rem">
                <Text>Health Factor</Text>
                <ModalIcon
                  position="relative"
                  top="0"
                  right="0"
                  ml="0.5rem"
                  transform="scale(0.75)"
                  onOpen={onSubmitHF}
                />
              </HStack>
              <Text fontWeight="bold" textAlign="left" mt="0.5em">
                {bigNumberToString(healthFactor)}
              </Text>
            </VStack>
          </Box>
        </UpperBox>
      </Flex>
      <Box mt="2rem" d="grid"  gridTemplateColumns={{base:"1fr", xl:"1fr 1fr"}}  gridGap="2.5rem" overflowX="auto">
        {depositsTable}
        {borrowsTable}
      </Box>
      <ModalComponent isOpen={isOpen} mtype={modal_type} onClose={onClose} />
    </Flex>
  );
};
