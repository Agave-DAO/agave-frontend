import React from "react";
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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";
import ColoredText from "../../components/ColoredText";
import { BigNumber } from "ethers";
import coloredAgaveLogo from "../../assets/image/colored-agave-logo.svg";

export interface StakingLayoutProps {
  agavePerMonth: number;
  cooldownPeriodSeconds: number;
  stakingAPY: number;
}

const StakingSubCard: React.FC<{
  isModalTrigger?: boolean;
  onClick: React.MouseEventHandler;
  title: string;
  value: string;
  subValue: string;
  buttonText: string;
}> = ({
  isModalTrigger,
  title,
  value,
  subValue,
  buttonText,
  children: modalChildren,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <VStack
      minW="20.8rem"
      px="2.2rem"
      py="1.9rem"
      bg="secondary.900"
      rounded="2xl"
      position="relative"
    >
      {isModalTrigger && (
        <Circle
          borderWidth="2px"
          minWidth="1.5rem"
          minHeight="1.5rem"
          boxSizing="content-box"
          as={Center}
          fontSize="1rem"
          color="#FFC01B"
          borderColor="#FFC01B"
          position="absolute"
          top="1rem"
          right="1rem"
          cursor="pointer"
          onClick={onOpen}
        >
          ?
        </Circle>
      )}
      <Text color="white" fontSize="1.7rem">
        {title}
      </Text>
      <ColoredText>{value}</ColoredText>
      <Text color="white" fontSize="1.2rem">
        {subValue}
      </Text>
      <Button
        color="white"
        fontSize="1.4rem"
        fontWeight="normal"
        bg="primary.300"
        py="1rem"
        my="1.2rem"
        width="100%"
        px="2.171rem"
      >
        {buttonText}
      </Button>
      {isModalTrigger && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent
            color="primary.900"
            bg="linear-gradient(180deg, #F3FFF7 8.89%, #DCFFF1 146.53%)"
            px="2.9rem"
            py="3.5rem"
            rounded="lg"
            minW="30vw"
            minH="30vh"
          >
            {modalChildren}
            <ModalFooter>
              <Button
                w="60%"
                m="auto"
                py="1.5rem"
                fontSize="1.4rem"
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

export const StakingLayout: React.FC<StakingLayoutProps> = ({
  agavePerMonth: _agavePerMonth,
  cooldownPeriodSeconds: _cooldownPeriodSeconds,
  stakingAPY: _stakingAPY,
}) => {
  const [amount, setAmount] = React.useState<BigNumber | undefined>(
    BigNumber.from(0)
  );
  return (
    <HStack spacing="1.6rem">
      <Center
        flexDirection="column"
        rounded="xl"
        minH="33.6rem"
        flex={1}
        bg="primary.900"
        px="5.2rem"
      >
        <ColoredText fontSize="1.8rem" marginBottom="1.3rem">
          How much you would like to stake?
        </ColoredText>
        <Text color="white" textAlign="center" marginBottom="2.8rem">
          Staking Agave in the Safety Module helps to secure the protocol in
          exchange for protocol incentives
        </Text>
        <Box w="100%">
          <VStack fontSize="1.5rem">
            <Flex w="100%" justifyContent="space-between">
              <Text color="white">Available to Stake</Text>
              <Text color="white">9.99 Agave</Text>
            </Flex>
            <WeiBox
              amount={amount}
              decimals={18}
              setAmount={setAmount}
              icon={coloredAgaveLogo}
              maxAmount={BigNumber.from(10).pow(18)}
            />
          </VStack>
        </Box>
        <Button
          textTransform="uppercase"
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px="6rem"
          py="1.5rem"
          fontSize="1.4rem"
        >
          Stake
        </Button>
      </Center>
      <Center
        flexDirection="column"
        rounded="xl"
        minH="33.6rem"
        flex={1}
        bg="primary.900"
        px="5.2rem"
      >
        <HStack spacing="3rem">
          <StakingSubCard
            isModalTrigger
            buttonText="Activate cooldown"
            title="Agave staked"
            value="8.782"
            subValue="$ 87893.23"
            onClick={() => {}}
          >
            <>
              <ModalHeader fontSize="1.6rem" fontWeight="bold">
                Cooldown & Unstake Window Period
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
            value="0.23"
            subValue="$ 87893.23"
            buttonText="Claim"
            onClick={() => {}}
          />
        </HStack>
        <VStack
          mt="1.7rem"
          color="white"
          fontSize="1.4rem"
          spacing=".5rem"
          width="100%"
        >
          <Flex width="100%" justifyContent="space-between">
            <Text>Agaave per month</Text>
            <Text fontWeight="bold">1.98</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Text>Cooldown period</Text>
            <Text fontWeight="bold">12 days</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between">
            <Text>Staking APY</Text>
            <Text fontWeight="bold">79.1%</Text>
          </Flex>
        </VStack>
      </Center>
    </HStack>
  );
};
