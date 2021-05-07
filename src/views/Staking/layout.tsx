import React from "react";
// import { WeiBox } from "../../components/Actions/WeiBox";
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
} from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/hooks";

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
      <Text
        color="white"
        fontSize="2.4rem"
        fontWeight="bold"
        bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
        backgroundClip="text"
      >
        {value}
      </Text>
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
  return (
    <HStack spacing="1.6rem">
      <Center
        flexBasis="100%"
        rounded="xl"
        minH="33.6rem"
        bg="primary.900"
        px="5.2rem"
      >
        hi
      </Center>
      <Center
        flexBasis="100%"
        rounded="xl"
        minH="33.6rem"
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
      </Center>
    </HStack>
  );
};
