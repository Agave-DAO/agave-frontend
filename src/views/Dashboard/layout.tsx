import React from "react";
import {
  Box,
  Button,
  Center,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { isMobileOnly } from 'react-device-detect'
import { useDisclosure } from "@chakra-ui/hooks";
import { ModalIcon } from "../../utils/icons";
import InfoWeiBox from "../common/InfoWeiBox";
import { fontSizes, spacings } from "../../utils/constants";

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
            My Dashboard
        </Text>
      </Center>
      )}
    </Box>
  );
};

const DepositsCard: React.FC<{
  isModalTrigger?: boolean;
  onClick: React.MouseEventHandler;
  balance: string;
  title: string;
}> = ({
  isModalTrigger,
  title,
  balance,
  onClick,
  children: modalChildren,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
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
      {isModalTrigger && <ModalIcon onOpen={onOpen} />}
      <Text
        color="white"
        fontSize={{ base: "1.2rem", md: "1.5rem" }}
        textAlign="center"
      >
        {title}
      </Text>
      <Text color="white" fontSize="1.2rem">
        {balance}
      </Text>
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
      )}
    </Box>
  );
};

const UpperBox: React.FC<{title: string;}> = ({
  title,
  children,
  ...props
}) => {
  return (
    <Center
      boxSizing="content-box"
      flexDirection="column"
      rounded="xl"
      minH="15.6rem"
      minW={{ base: "100%", lg: "auto" }}
      flex={1}
      bg="primary.900"
      py="1.5rem"
      {...props}
    >
      <VStack
        divider={<StackDivider borderColor="#36CFA2" h="0.188rem" backgroundColor="#36CFA2"/>}
        spacing={4}
        w='100%'
        align="stretch"
        flexDirection="column"
      >
        <Text 
          px={{ base: "2rem", md: "3rem" }}
          h="25">
          {title}
        </Text>
        <Box px={{ base: "2rem", md: "3rem" }}>
          {children}
        </Box>
      </VStack>

    </Center>
  );
};

export const DashboardLayout: React.FC<{}> = () => {
  
  return (
    <Flex
      align="center"
      flexBasis="auto"
      spacing="1em"
      w="100%"
      flexDirection={{ base: "column", lg: "row" }}
      m="auto"
      color="white"
    >
      <UpperBox title="Deposit Information" marginRight={{ base: "2.6rem" }}>
        <Box h={60}>

        </Box>
      </UpperBox>
      <UpperBox title="Borrow Information">
        <Box h={60}>

        </Box>
      </UpperBox>
    </Flex>
  );
};
