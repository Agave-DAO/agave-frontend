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
//import { BigNumber, BigNumberish, constants, FixedNumber } from "ethers";
//import coloredAgaveLogo from "../../assets/image/colored-agave-logo.svg";
import { useAppWeb3 } from "../../hooks/appWeb3";

export interface DepositBannerProps {}

export interface DepositLayoutProps {}

export const DepositBanner: React.FC<DepositBannerProps> = props =>  {
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
      	Deposit
      </Text>
    </Center>
  );
};

/*
const DepositSubCard: React.FC = () => {
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
      {buttonOverrideContent === undefined ? (
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
          onClick={onClick}
        >
          {buttonText}
        </Button>
      ) : (
        <>{buttonOverrideContent}</>
      )}
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
*/


export const DepositLayout: React.FC<DepositLayoutProps> = () => {
  
	return (
    <VStack
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
        mb={{ base: "0.1rem", md: "0" }}
      >
        <ColoredText
          fontSize={{ base: "1.6rem", md: "1.8rem" }}
          marginBottom="1.3rem"
          textAlign="center"
        >
          How much you would like to stake?
        </ColoredText>
        
      </Center>
    </VStack>
  );
};
