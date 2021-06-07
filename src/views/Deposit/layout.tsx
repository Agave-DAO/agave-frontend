// import { Center, Text, VStack } from "@chakra-ui/layout";
import { BigNumber } from "ethers";
import React from "react";
import {
  Box,
  Center,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import Switch from '../../components/Switch'
import Search from '../../components/Search'
import DTable from './DepositTable'

export interface DepositBannerProps {}

export interface DepositLayoutProps {
  activeValue: string;
  setActiveValue: (active: any) => void;
}

export const DepositBanner: React.FC<{}> = () =>  {
  return (
    <Center
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

export const DepositLayout: React.FC<DepositLayoutProps> = props => {
	return (
    <VStack
      spacing={{ md: "1.6rem" }}
      flexDirection={{ base: "column", md: "row" }}
      px={{ base: "2.4rem", md: "0" }}
      mb={10}
      height="100%"
    >
      <Center
        boxSizing="content-box"
        rounded="xl"
        minH="12.75rem"
        w="100%"
        bg="primary.900"
        py="2.4rem"
        mb={{ base: "0.1rem", md: "0" }}
        color="white"
      >
        <VStack
          divider={<StackDivider borderColor="#36CFA2" h="0.188rem" backgroundColor="#36CFA2"/>}
          spacing={4}
          w='100%'
          align="stretch"
          flexDirection="column"
        >
          <Box 
            h={{
              base: 100, // 0-48em
              md: 45, // 48em-80em,
              xl: 25, // 80em+
            }}
            ml={{
              md: 27,
              xl: 27
            }}
            mb={{
              base: 5,
              md: 5,
              xl: 0
            }}
            maxW={{
              base: "100%", // 0-48em
              md: "90%", // 48em-80em,
              xl: "70%", // 80em+
            }}
            d="flex"
            flexGrow={1}
            flexDirection={{ base: "column", md: "row", xl: "row" }}
          >
            <Box
              d="flex"
              flexDirection={{ base: "row", md: "column", xl: "row" }}
              justifyContent="center"
              h="100%"
            >
              <Text>
                Available to deposit
              </Text>
            </Box>
          </Box>
          <Box 
            w="100%"
            pl={27}
            pr={27}
            pt={5}
            d="flex"
            flexDirection={{ base: "column", md: "row", xl: "column" }}
            justifyContent="space-between"
            flexGrow={2}
          >
            <Box
              d="flex"
              flexDir="row"
              w="100%"
              justifyContent="space-between"
            >
              <Switch 
                values={['All', 'Stable Coins']}
                activeValue={props.activeValue}
                setActiveValue={props.setActiveValue}
              />
              <Search
                placeholder="Search"
                w={185}
                h={26}
              />
            </Box>
            <Box
              mt={5}
              overflow="scroll"
              bottom={10}
            >
              <DTable activeType="All"/>
            </Box>
          </Box>
        </VStack>   
      </Center>
    </VStack>
  );
};
