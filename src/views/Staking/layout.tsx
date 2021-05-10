import React, { useState } from "react";
import { WeiBox } from "../../components/Actions/WeiBox";
import {
  Center,
  HStack,
  Text,
  Button,
  VStack,
  Circle,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  Flex,
  Input,
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import ColoredText from "../../components/ColoredText";
import { BigNumber, BigNumberish, constants, FixedNumber } from "ethers";
import coloredAgaveLogo from "../../assets/image/colored-agave-logo.svg";
import { useStakingAgavePrice, useTotalStakedForAllUsers } from "./queries";

export interface StakingBannerProps {}

export interface StakingLayoutProps {
  yieldPerAgavePerSecond: BigNumber | undefined;
  cooldownPeriodSeconds: BigNumberish | undefined;
  unstakeWindowSeconds: BigNumberish | undefined;
  agavePriceUsd: BigNumber | undefined;
  amountStaked: BigNumber | undefined;
  availableToClaim: BigNumber | undefined;
  availableToStake: BigNumber | undefined;
  activateCooldown: () => void;
  claimRewards: (toAddress: string) => void;
  stake: (amount: BigNumber) => void;
  unstake: () => void;
}

export const StakingBanner: React.FC<StakingBannerProps> = props => {
  const totalAgaveStaked = useTotalStakedForAllUsers().data;
  const agavePriceInNative = useStakingAgavePrice().data;
  const tokensLocked = totalAgaveStaked
    ? (totalAgaveStaked
        ? FixedNumber.fromValue(totalAgaveStaked, 18).round(2).toString()
        : "0") + " AGVE"
    : undefined;
  const tvl =
    agavePriceInNative !== undefined
      ? "$ " +
        (totalAgaveStaked
          ? FixedNumber.fromValue(
              totalAgaveStaked
                .mul(agavePriceInNative)
                .div(constants.WeiPerEther),
              18
            )
              .round(2)
              .toUnsafeFloat()
              .toLocaleString()
          : "0.00") +
        ` (${tokensLocked})`
      : tokensLocked;

  return (
    <Center
      px={{ base: "2.3rem", md: "4.7rem" }}
      width="100%"
      justifyContent="space-between"
    >
      <Text
        fontWeight="bold"
        color="white"
        fontSize={{ base: "1.8rem", md: "2.4rem" }}
      >
        Staking
      </Text>
      <Center
        flexDirection={{ base: "column", md: "row" }}
        alignItems={{ base: "flex-end", md: "center" }}
      >
        {tvl ? (
          <>
            <Text
              color="white"
              fontSize={{ base: "1.2rem", md: "1.6rem" }}
              mr={{ md: "1.2rem" }}
            >
              Funds in the Safety Module
            </Text>
            <Text
              fontSize={{ base: "1.6rem", md: "2.4rem" }}
              fontWeight="bold"
              bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
              backgroundClip="text"
            >
              {tvl}
            </Text>
          </>
        ) : null}
      </Center>
    </Center>
  );
};

const StakingSubCard: React.FC<{
  isModalTrigger?: boolean;
  onClick: React.MouseEventHandler;
  title: string;
  value: string;
  subValue: string;
  disabled?: boolean;
  buttonText: string;
}> = ({
  isModalTrigger,
  title,
  value,
  subValue,
  disabled,
  buttonText,
  children: modalChildren,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <VStack
      w="50%"
      justifyContent="space-between"
      px={{ base: "1.1rem", md: "2.2rem" }}
      py={{ base: "1.3rem", md: "1.9rem" }}
      bg="secondary.900"
      rounded="2xl"
      position="relative"
      minH="14.4rem"
    >
      {isModalTrigger && (
        <Circle
          borderWidth={{ base: "1px", md: "2px" }}
          width={{ base: "1.2rem", md: "1.5rem" }}
          minHeight={{ base: "1.2rem", md: "1.5rem" }}
          boxSizing="content-box"
          as={Center}
          fontSize={{ base: ".85rem", md: "1rem" }}
          color="#FFC01B"
          borderColor="#FFC01B"
          position="absolute"
          top={{ base: "0.75rem", md: "1rem" }}
          right={{ base: "0.75rem", md: "1rem" }}
          cursor="pointer"
          onClick={onOpen}
        >
          ?
        </Circle>
      )}
      <Text
        color="white"
        fontSize={{ base: "1.2rem", md: "1.5rem" }}
        textAlign="center"
      >
        {title}
      </Text>
      <ColoredText>{value}</ColoredText>
      <Text color="white" fontSize="1.2rem">
        {subValue}
      </Text>
      <Button
        color="white"
        fontSize={{ base: "1rem", md: "1.4rem" }}
        fontWeight="normal"
        bg="primary.300"
        py="1rem"
        my="1.2rem"
        width="100%"
        px={{ base: "5%", md: "2.171rem" }}
        disabled={disabled}
      >
        {buttonText}
      </Button>
      {isModalTrigger && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent
            color="primary.900"
            bg="linear-gradient(180deg, #F3FFF7 8.89%, #DCFFF1 146.53%)"
            px={{ base: "1.5rem", md: "2.9rem" }}
            py="3.5rem"
            rounded="lg"
            minW={{ base: "80%", md: "30vw" }}
            minH={{ base: "50%", md: "30vh" }}
          >
            {modalChildren}
            <ModalFooter>
              <Button
                w={{ base: "100%", md: "60%" }}
                m="auto"
                py="1.5rem"
                fontSize={{ base: "1.6rem", md: "1.4rem" }}
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
      )}
    </VStack>
  );
};

export function secondsToString(numSeconds: BigNumberish): String {
  const cdps = BigNumber.from(numSeconds);
  if (cdps.lt(60)) {
    return `${Math.round(cdps.toNumber() * 10) / 10} seconds`;
  }
  if (cdps.lt(60 * 60)) {
    return `${Math.round((cdps.toNumber() / 60) * 10) / 10} minutes`;
  }
  if (cdps.lt(60 * 60 * 24)) {
    return `${Math.round((cdps.toNumber() / (60 * 60)) * 10) / 10} hours`;
  }
  return `${Math.round((cdps.toNumber() / (60 * 60 * 24)) * 10) / 10} days`;
}

export const StakingLayout: React.FC<StakingLayoutProps> = ({
  yieldPerAgavePerSecond,
  cooldownPeriodSeconds,
  unstakeWindowSeconds,
  amountStaked,
  availableToClaim,
  availableToStake,
  agavePriceUsd,
  activateCooldown,
  claimRewards,
  stake,
  unstake,
}) => {
  const [customAddress, setCustomAddress] = useState<string>("");
  function dollarValueStringOf(agaveAmount: BigNumber | undefined): String {
    if (agavePriceUsd === undefined || agaveAmount === undefined) {
      return "-";
    }
    return FixedNumber.fromValue(
      agavePriceUsd.mul(agaveAmount).div(constants.WeiPerEther),
      18
    )
      .round(2)
      .toString();
  }

  const cooldownPeriod = React.useMemo(() => {
    if (cooldownPeriodSeconds === undefined) {
      return "-";
    }
    return secondsToString(cooldownPeriodSeconds);
  }, [cooldownPeriodSeconds]);

  const unstakeWindow = React.useMemo(() => {
    if (unstakeWindowSeconds === undefined) {
      return "-";
    }
    return secondsToString(unstakeWindowSeconds);
  }, [unstakeWindowSeconds]);

  const [amount, setAmount] = React.useState<BigNumber | undefined>(
    BigNumber.from(0)
  );
  const yieldPerSecond = React.useMemo(
    () =>
      amountStaked
        ? yieldPerAgavePerSecond?.mul(amountStaked).div(constants.WeiPerEther)
        : undefined,
    [amountStaked, yieldPerAgavePerSecond]
  );

  const [yieldPerMonth, yieldPerYear] = React.useMemo(
    () => [
      yieldPerSecond?.mul(60 * 60 * 24 * 31),
      yieldPerSecond?.mul(60 * 60 * 24 * 365),
    ],
    [yieldPerSecond]
  );
  const stakingAPY = React.useMemo(
    () =>
      amountStaked?.gt(0) && yieldPerYear?.gt(0)
        ? FixedNumber.fromValue(
            amountStaked
              .add(yieldPerYear)
              // .div(constants.WeiPerEther)
              .sub(amountStaked),
            // .divUnsafe(FixedNumber.fromValue(amountStaked.add(yieldPerYear), 18))
            // .subUnsafe(FixedNumber.fromValue(constants.WeiPerEther, 18))
            18
          )
            .round(2)
            .toString()
        : amountStaked !== undefined && yieldPerYear !== undefined
        ? "0"
        : "-",
    [amountStaked, yieldPerYear]
  );
  return (
    <HStack
      spacing={{ md: "1.6rem" }}
      flexDirection={{ base: "column", md: "row" }}
      px={{ base: "2.4rem", md: "0" }}
    >
      <Center
        boxSizing="content-box"
        flexDirection="column"
        rounded="xl"
        minH="35.6rem"
        minW={{ base: "100%", md: "inherit" }}
        flex={1}
        bg="primary.900"
        px={{ base: "2rem", md: "4rem" }}
        py="2.4rem"
        mb={{ base: "2.6rem", md: "0" }}
      >
        <ColoredText
          fontSize={{ base: "1.6rem", md: "1.8rem" }}
          marginBottom="1.3rem"
          textAlign="center"
        >
          How much you would like to stake?
        </ColoredText>
        <Text
          color="white"
          textAlign="center"
          marginBottom="2.8rem"
          fontSize={{ base: "1.4rem", md: "inherit" }}
        >
          Staking Agave in the Safety Module helps to secure the protocol in
          exchange for protocol incentives
        </Text>
        <Box w="100%">
          <VStack fontSize="1.5rem">
            <Flex
              w="100%"
              justifyContent="space-between"
              fontSize={{ base: "1.4rem", md: "inherit" }}
            >
              <Text color="white" fontSize="inherit">
                Available to Stake
              </Text>
              <Text color="white" fontSize="inherit">
                {availableToStake &&
                  FixedNumber.fromValue(availableToStake, 18).toString()}{" "}
                Agave
              </Text>
            </Flex>
            <WeiBox
              amount={amount}
              decimals={18}
              setAmount={setAmount}
              icon={coloredAgaveLogo}
              maxAmount={availableToStake}
            />
          </VStack>
        </Box>
        <Button
          mt="2.4rem"
          textTransform="uppercase"
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize="1.4rem"
          disabled={
            amount === undefined ||
            amount.lte(0) ||
            availableToStake === undefined ||
            amount.gt(availableToStake)
          }
          onClick={() => {
            if (amount) {
              setAmount(constants.Zero);
              stake(amount);
            }
          }}
        >
          Stake
        </Button>
      </Center>
      <Center
        boxSizing="content-box"
        flexDirection="column"
        rounded="xl"
        minH="35.6rem"
        minW={{ base: "100%", md: "inherit" }}
        flex={1}
        bg="primary.900"
        px={{ base: "2rem", md: "4rem" }}
        py="2.4rem"
        mb={{ base: "2.6rem", md: "0" }}
      >
        <HStack spacing={{ base: "1rem", md: "2rem" }} w="100%">
          <StakingSubCard
            isModalTrigger
            buttonText="Activate cooldown"
            title="Agave staked"
            value={
              amountStaked
                ? FixedNumber.fromValue(amountStaked, 18).toString()
                : "-"
            }
            subValue={`$ ${dollarValueStringOf(amountStaked)}`}
            disabled={!(amountStaked?.gt(0) ?? false)}
            onClick={() => {}}
          >
            <>
              <ModalHeader fontSize="1.6rem" fontWeight="bold">
                Cooldown &amp; Unstake Window Period
              </ModalHeader>
              <ModalBody>
                You can only withdraw your assets from the Security Module after
                the cooldown period ends and the unstake window is active. The
                cooldown period can be activated by pressing the ‘Activate
                Cooldown’ button. Once the time expires, you’re free to withdraw
                within the time frame of the unstake window. If you fail to
                withdraw your assets during the unstake window, you need to
                activate the cooldown period again and wait for the next unstake
                window.
              </ModalBody>
            </>
          </StakingSubCard>
          <StakingSubCard
            title="Claimable Agave"
            value={
              availableToClaim
                ? FixedNumber.fromValue(availableToClaim, 18).toString()
                : "-"
            }
            subValue={`$ ${dollarValueStringOf(availableToClaim)}`}
            buttonText="Claim"
            disabled={!(availableToClaim?.gt(0) ?? false)}
            onClick={() => {}}
          />
        </HStack>
        <Input
          size="lg"
          py="1.5rem"
          variant="filled"
          my="2rem"
          placeholder="Custom Recipient Address (Current Account Default)"
          _hover={{ background: "secondary.900" }}
          _focus={{ background: "secondary.900" }}
          background="secondary.900"
          fontSize={{ base: "1.4rem", md: "1.6rem" }}
          width="100%"
          color="white"
          name="customAddress"
          onChange={e => setCustomAddress(e.target.value)}
          value={customAddress}
        />
        <VStack
          color="white"
          fontSize="1.4rem"
          spacing={{ base: "1rem", md: ".5rem" }}
          width="100%"
        >
          <Flex width="100%" justifyContent="space-between">
            <Text>Agave per month</Text>
            <Text fontWeight="bold">
              {yieldPerMonth
                ? FixedNumber.fromValue(yieldPerMonth, 18).round(2).toString()
                : "-"}
            </Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Text>Cooldown period</Text>
            <Text fontWeight="bold">{cooldownPeriod}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Text>Unstake Window</Text>
            <Text fontWeight="bold">{unstakeWindow}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Text>Staking APY</Text>
            <Text fontWeight="bold">
              {yieldPerYear
                ? FixedNumber.fromValue(yieldPerYear, 18).round().toString()
                : "-"}
              /yr or %{stakingAPY}
            </Text>
          </Flex>
        </VStack>
      </Center>
    </HStack>
  );
};
