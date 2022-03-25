import React, { useState } from "react";
import {
  Box,
  Center,
  StackDivider,
  Text,
  VStack,
  Spinner,
  Select,
  Tabs, 
  TabList,  
  Tab, 
} from "@chakra-ui/react";
import { CenterProps } from "@chakra-ui/layout";
import { TabContent } from "./tabContent"
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useNativeSymbols } from "../../utils/icons";


export const BalanceColumn: React.FC<{
    props?: CenterProps;
}> = ({ ...props }) => {
  return (
    <Center
      boxSizing="content-box"
      flexDirection="column"
      rounded="xl"
      minH="10.6rem"
      minW={{ base: "34%", xl: "auto" }}
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
          somo
        </Text>
        <Box px={{ base: "2rem", md: "3rem" }}></Box>
      </VStack>
    </Center>
  )
}
