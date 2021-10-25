import React, { useState } from "react";
import {
  Box,
  Center,
  Flex,
  StackDivider,
  Text,
  VStack,
  useMediaQuery,
  useColorModeValue as mode,
  Button,
  Image,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import {
  bigNumberToString,
  fixedNumberToPercentage,
} from "../../utils/fixedPoint";
import { CenterProps, HStack } from "@chakra-ui/layout";
import { isMobileOnly } from "react-device-detect";
import { ModalIcon } from "../../utils/icons";
import { DashboardTable, DashboardTableType } from "./table";
import { DashboardEmptyState } from "./emptyState";
import { useHistory } from "react-router-dom";
import { AssetData } from ".";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { BigNumber, constants } from "ethers";
import { useUserAccountData } from "../../queries/userAccountData";
import { useAppWeb3 } from "../../hooks/appWeb3";
import ModalComponent, { MODAL_TYPES } from "../../components/Modals";
import agaveLogo from "../../assets/image/agave-logo.svg";

interface DashboardProps {
  borrowed: BigNumber | undefined;
  borrows: AssetData[] | undefined;
  collateral: BigNumber | undefined;
  deposits: AssetData[];
  healthFactor: BigNumber | undefined;
}

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
          <Center borderColor="white" borderWidth="1px" padding="10px" borderRadius="5px">
            <Text color="white" fontSize={{ base: "1rem", md: "2rem" }} pr="20px">
              Available reward
            </Text>

            <Text color="white" fontSize={{ base: "1rem", md: "2rem" }} pr="4px">
              &lt; 0.01
            </Text>
            <Image src={agaveLogo} alt="AGAVE ALT" width={{ base: "22px" }} pb="3.5px" />
            <Button
              minWidth="9rem"
              height={{ base: "4rem", md: "3rem" }}
              fontSize={{ base: "3xl", md: "2xl" }}
              ml="1.5rem"
              px="1.5rem"
              color="white"
              bg={mode(
                { base: "secondary.800", md: "primary.500" },
                "primary.500"
              )}
              rounded="lg"
              fontWeight="400"
            >
              Claim
            </Button>
          </Center>
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

const DashboardApproximateBalanceDisplay: React.FC<{}> = () => {
  const balancesDaiWei = useUserDepositAssetBalancesDaiWei();
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

  const { account: userAccountAddress } = useAppWeb3();
  const { data: userAccountData } = useUserAccountData(
    userAccountAddress ?? undefined
  );

  const onSubmitAP = React.useCallback(() => {
    setModal(MODAL_TYPES.APROXIMATE_BALANCE);
    onOpen();
  }, [onOpen]);

  const onSubmitHF = React.useCallback(() => {
    setModal(MODAL_TYPES.HEALTH_FACTOR);
    onOpen();
  }, [onOpen]);

  const onSubmitLTV = React.useCallback(() => {
    setModal(MODAL_TYPES.CURRENT_LTV);
    onOpen();
  }, [onOpen]);

  const [isMobile] = useMediaQuery("(max-width: 32em)");

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
          mr={{ base: "inherit", lg: "2%" }}
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
            <Text fontWeight="bold" textAlign="left" mt="0.5em">
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
            whiteSpace="nowrap"
            h="7.5rem"
          >
            <Box h="7rem" mt="0.5rem">
              <Text>Borrowed</Text>
              <Text fontWeight="bold" textAlign="left" mt="0.5em">
                {borrowed ? `$ ${bigNumberToString(borrowed)}` : "-"}
              </Text>
            </Box>
            <Box h="7rem" mt="0.5rem" ml={{ base: "1rem", md: "3rem" }}>
              <Text>Collateral</Text>
              <Text fontWeight="bold" textAlign="left" mt="0.5em">
                {collateral ? `$ ${bigNumberToString(collateral)}` : "-"}
              </Text>
            </Box>
            <VStack
              flexDirection="column"
              h="7rem"
              alignItems="center"
              ml={{ base: "1rem", md: "3rem" }}
            >
              <HStack d="flex" mt="0.5rem">
                <Text>{isMobile ? "HF" : "Health Factor"}</Text>
                <ModalIcon
                  position="relative"
                  top="0"
                  right="0"
                  ml="0.5rem"
                  transform="scale(0.75)"
                  onOpen={onSubmitHF}
                />
              </HStack>
              <Text fontWeight="bold" textAlign="center" mt="0.5em">
                {bigNumberToString(healthFactor)}
              </Text>
            </VStack>
            <VStack
              flexDirection="column"
              h="7rem"
              alignItems="center"
              ml={{ base: "1rem", md: "3rem" }}
            >
              <HStack d="flex" mt="0.5rem">
                <Text>{isMobile ? "LTV" : "Current LTV"}</Text>
                <ModalIcon
                  position="relative"
                  top="0"
                  right="0"
                  ml="0.5rem"
                  transform="scale(0.75)"
                  onOpen={onSubmitLTV}
                />
              </HStack>
              <Text fontWeight="bold" textAlign="left" mt="0.5em">
                {fixedNumberToPercentage(userAccountData?.currentLtv)}
              </Text>
            </VStack>
          </Box>
        </UpperBox>
      </Flex>
      <Box mt="2rem" overflowX="auto">
        {depositsTable}
        {borrowsTable}
      </Box>
      <ModalComponent isOpen={isOpen} mtype={modal_type} onClose={onClose} />
    </Flex>
  );
};
