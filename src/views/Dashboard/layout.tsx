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
import { CenterProps, HStack } from "@chakra-ui/layout";
import { isMobileOnly } from 'react-device-detect'
import { ModalIcon } from "../../utils/icons";
import DashboardTable, { DashboardTableType } from "./DashboardTable";

interface DashboardProps {
  balance: string | undefined;
  borrowed: string | undefined;
  collateral: string | undefined;
  healthFactor: string | undefined;
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
            My Dashboard
        </Text>
      </Center>
      )}
    </Box>
  );
};

const UpperBox: React.FC<{title: string;} & CenterProps> = ({
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

export const DashboardLayout: React.FC<DashboardProps> = props => {
  
  return (
    <Flex
      flexDirection="column"
    >
      <Flex
        align="center"
        flexBasis="auto"
        spacing="1em"
        w="100%"
        flexDirection={{ base: "column", lg: "row" }}
        m="auto"
        color="white"
      >
        <UpperBox title="Deposit Information" mr="2rem">
          <VStack flexDirection="column" h="7.5rem" alignItems="baseline">
            <HStack d="flex" mt="0.5rem">
              <Text>Aproximate Balance</Text>
              <ModalIcon
                position="relative"
                top="0"
                right="0"
                ml="0.5rem"
                transform="scale(0.75)"
                onOpen={()=>{}}
                />
            </HStack>  
            <Text fontWeight="bold" textAlign="left" mt="0.5em">{props.balance ?? "-"}</Text>
          </VStack>
        </UpperBox>
        <UpperBox title="Borrow Information">
          <Box 
            d="flex"
            flexDirection="row"
            justifyContent="space-between"
            pr="6rem"
            h="7.5rem" 
            >
            <Box h="7rem" mt="0.5rem">
              <Text>Borrowed</Text>
              <Text fontWeight="bold" textAlign="left" mt="0.5em">{props.borrowed ?? "-"}</Text>
            </Box>
            <Box h="7rem" mt="0.5rem" ml="4rem">
              <Text>Collateral</Text>
              <Text fontWeight="bold" textAlign="left" mt="0.5em">{props.collateral ?? "-"}</Text>
            </Box>
            <VStack flexDirection="column" h="7rem" alignItems="baseline" ml="4rem">
              <HStack d="flex" mt="0.5rem">
                <Text>Health Factor</Text>
                <ModalIcon
                  position="relative"
                  top="0"
                  right="0"
                  ml="0.5rem"
                  transform="scale(0.75)"
                  onOpen={()=>{}}
                  />
              </HStack>  
              <Text fontWeight="bold" textAlign="left" mt="0.5em">{props.healthFactor ?? "-"}</Text>
              </VStack>
            </Box>
        </UpperBox>
      </Flex>
      <HStack spacing={8}>
        <DashboardTable mode={DashboardTableType.Deposit}/>
        <DashboardTable mode={DashboardTableType.Borrow}/>
      </HStack>
    </Flex>
  );
};
