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
  Spinner,
  keyframes,
  Tooltip
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
import { Link, useHistory } from "react-router-dom";
import { AssetData } from ".";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { BigNumber, constants, ethers } from "ethers";
import { useUserAccountData } from "../../queries/userAccountData";
import { useAppWeb3 } from "../../hooks/appWeb3";
import ModalComponent, { MODAL_TYPES } from "../../components/Modals";
import gnoagave from "../../assets/image/gnoagave.png";
import carrot from "../../assets/image/carrot.png";
import { useClaimRewardsMutation } from "../../mutations/claimRewards";
import { useAllProtocolTokens } from "../../queries/allATokens";
import { useUserRewards } from "../../queries/rewardTokens";
import ColoredText from "../../components/ColoredText";

interface DashboardProps {
  borrowed: BigNumber | undefined;
  borrows: AssetData[] | undefined;
  collateral: BigNumber | undefined;
  deposits: AssetData[];
  healthFactor: BigNumber | undefined;
}

const ClaimRewardsBox: React.FC<{}> = () => {
  const w3 = useAppWeb3();

  let queriedAssets: string[] = [];
  const { data: tokens } = useAllProtocolTokens();
  tokens?.map(asset => {
    queriedAssets = [
      ...queriedAssets,
      asset.aTokenAddress,
      asset.variableDebtTokenAddress,
    ];
    return;
  });

  const claimRewardsMutation = useClaimRewardsMutation({
    chainId: w3.chainId ?? undefined,
    address: w3.account ?? undefined,
  });

  const claimRewardsMutationCall = React.useMemo(
    () => (assets: string[], amount: BigNumber) =>
      w3.library
        ? claimRewardsMutation.mutate({
            assets,
            amount,
            library: w3.library,
          })
        : undefined,
    [claimRewardsMutation, w3.library]
  );

  const spin = keyframes`
  0% {transform: rotate(0deg);}
  50% {transform: rotate(40deg);}
  100% {transform: rotate(0deg)}
`;
  const bounce = keyframes`
0%, 20%, 40%, 60%, 80%, 100% {transform: translateX(0);}
20% {transform: translateY(3px);}
80% {transform: translateY(-3px);}
`;

  const spinAnimation = `${spin} infinite 2.5s linear`;
  const bounceAnimation = `${bounce} infinite 2.5s linear`;

  const rewardsBalance = useUserRewards().data;
  return rewardsBalance ? (
    <Tooltip
    placement="top-end"
    bg="gray.700"
    label="Rewards in CPT tokens. Click icon for more info"
    fontSize="xl"
    openDelay={400}
  >
    <Center
      borderColor="white"
      borderWidth="1px"
      padding="10px"
      borderRadius="5px"
      bg="secondary.500"
    >
      <a
        href="https://gnosis.symm.fi/#/pool/0x870bb2c024513b5c9a69894dcc65fb5c47e422f3000200000000000000000014"
        target="_blank"
      >
        <Image
          src={gnoagave}
          alt="gnoagave"
          width={{ base: "6rem" }}
          animation={bounceAnimation}
          //transform="rotate(0.3turn)"
        />
      </a>
      <ColoredText
        color="white"
        fontSize={{ base: "1rem", md: "2rem" }}
        px="6px"
      >
        {rewardsBalance && rewardsBalance._isBigNumber
          ? bigNumberToString(rewardsBalance, 6, 18)
          : ""}
      </ColoredText>
      <Button
        minWidth="9rem"
        height={{ base: "4rem", md: "3rem" }}
        fontSize={{ base: "3xl", md: "2xl" }}
        ml="1.5rem"
        px="1.5rem"
        color="white"
        bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
        rounded="lg"
        fontWeight="400"
        onClick={() => {
          claimRewardsMutationCall(queriedAssets, ethers.constants.MaxUint256);
        }}
      >
        Claim
      </Button>
    </Center>
    </Tooltip>
  ) : null;
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
          <ClaimRewardsBox />
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
                {borrowed ? (
                  `$ ${bigNumberToString(borrowed)}`
                ) : (
                  <Spinner
                    speed="0.5s"
                    emptyColor="gray.200"
                    color="yellow.500"
                  />
                )}
              </Text>
            </Box>
            <Box h="7rem" mt="0.5rem" ml={{ base: "1rem", md: "3rem" }}>
              <Text>Collateral</Text>
              <Text fontWeight="bold" textAlign="left" mt="0.5em">
                {collateral ? (
                  `$ ${bigNumberToString(collateral)}`
                ) : (
                  <Spinner
                    speed="0.5s"
                    emptyColor="gray.200"
                    color="yellow.500"
                  />
                )}
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
