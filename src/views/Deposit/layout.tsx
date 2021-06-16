import React from "react";
import {
  Box,
  Center,
  Flex,
  Link,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import Switch from '../../components/Switch'
import Search from '../../components/Search'
import DTable from './DepositTable'
import { DepositAsset } from ".";
import MyDepositsTable from "./DepositMyDepositsTable"

export interface DepositBannerProps {}

export interface DepositLayoutProps {
  activeValue: string;
  setActiveValue: (active: any) => void;
  depositedList: DepositAsset[] | undefined
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
      <Text>
        Need your Polygon (Matic) or BSC assets on xDai? Please visit <Link fontWeight="bold">xpollinate.io</Link>
      </Text>
    </Center>
  );
};

export const DepositLayout: React.FC<DepositLayoutProps> = props => {
  const deposits: DepositAsset[] = props.depositedList ? props.depositedList : []
	return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      px={{ base: "2.4rem", md: "0" }}
      mb={10}
      height="100%"
      alignItems="flex-start"
    >
      <Box
        boxSizing="content-box"
        rounded="xl"
        minH="12.75rem"
        w="100%"
        bg="primary.900"
        py="2rem"
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
              {/* Disabled for now, no enough rows to be filtered */}
              {/* <Search
                placeholder="Search"
                w={185}
                h={26}
              /> */}
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
      </Box>
      { deposits.length > 0 && (
        <MyDepositsTable deposits={deposits} />
      )}
    </Flex>
  );
};
