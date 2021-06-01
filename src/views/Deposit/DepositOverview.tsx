import React from "react";
import {
  Box,
  Center,
  Circle,
  Spacer,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react";
import { IMarketData } from "../../utils/constants";

export interface DepositOverviewProps {
  asset: IMarketData;
  agaveBalance: Number;
  walletBalance: Number;
  healthFactor: Number;
  utilizationRate: Number;
  availableLiquidity: Number;
  depositAPY: Number;
  usedAsCollateral: Boolean;
  assetPrice: Number;
  maxLTV: Number;
}

export const DepositOverview: React.FC<DepositOverviewProps> = props => {
  return (
    <Center
      boxSizing="content-box"
      rounded="xl"
      minH="12.75rem"
      minW={{ base: "100%", md: "inherit" }}
      bg="primary.900"
      py="2.4rem"
      mb={{ base: "0.1rem", md: "0" }}
      color="white"
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
        <Box
          h={{
            base: 100, // 0-48em
            md: 45, // 48em-80em,
            xl: 30, // 80em+
          }}
          ml={{
            md: 27,
            xl: 27,
          }}
          mb={{
            base: 5,
            md: 5,
            xl: 0,
          }}
          maxW={{
            base: "100%", // 0-48em
            md: "90%", // 48em-80em,
            xl: "70%", // 80em+
          }}
          d="flex"
          flexDirection={{ base: "column", md: "row", xl: "row" }}
        >
          <Box
            d="flex"
            flexDirection={{ base: "row", md: "column", xl: "row" }}
            justifyContent="center"
          >
            <Text>Your balance in Agave</Text>
            <Text ml="0.813rem">
              <b>{props.agaveBalance}</b> {props.asset.name}
            </Text>
          </Box>
          <Spacer />
          <Box
            d="flex"
            flexDirection={{ base: "row", md: "column", xl: "row" }}
            justifyContent="center"
          >
            <Text>Your wallet balance</Text>
            <Text ml="0.813rem">
              <b>{props.walletBalance}</b> {props.asset.name}
            </Text>
          </Box>
          <Spacer />
          <Box
            d="flex"
            flexDirection={{ base: "row", md: "column", xl: "row" }}
            justifyContent="center"
          >
            <Box d="flex">
              <Text>Health factor</Text>
              <IconQuestion onClick={() => {}} />
            </Box>
            <Text
              ml="0.813rem"
              bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
              backgroundClip="text"
              fontWeight="bold"
            >
              {props.healthFactor}
            </Text>
          </Box>
        </Box>
        <Box
          w="100%"
          h={{
            base: 380, // 0-48em
            md: 100, // 48em-80em,
            xl: 90, // 80em+
          }}
          pl={27}
          pr={27}
          pt={5}
          d="flex"
          flexDirection={{ base: "column", md: "row", xl: "row" }}
          justifyContent="space-between"
        >
          <VStack mt={5}>
            <Text color="white" textAlign="center">
              Utilization rate
            </Text>
            <Text fontWeight="bold">{props.utilizationRate} %</Text>
          </VStack>
          <Spacer />
          <VStack mt={5}>
            <Text color="white" textAlign="center">
              Available Liquidity
            </Text>
            <Text fontWeight="bold">
              {props.availableLiquidity + " " + props.asset.name}
            </Text>
          </VStack>
          <Spacer />
          <VStack mt={5}>
            <Text color="white" textAlign="center">
              Deposit APY
            </Text>
            <Text fontWeight="bold">{props.depositAPY} %</Text>
          </VStack>
          <Spacer />
          <VStack mt={5}>
            <Text color="white" textAlign="center">
              Can be used as collateral
            </Text>
            <Text fontWeight="700" color="yellow.100">
              {props.usedAsCollateral ? "Yes" : "No"}
            </Text>
          </VStack>
          <Spacer />
          <VStack mt={5}>
            <Text color="white" textAlign="center">
              Asset Price
            </Text>
            <Text fontWeight="bold">{props.assetPrice} USD</Text>
          </VStack>
          <Spacer />
          <VStack mt={5}>
            <Box d="flex" alignItems="center">
              <Text color="white" textAlign="center">
                Maximum LTV
              </Text>
              <IconQuestion onClick={() => {}} />
            </Box>
            <Text fontWeight="bold">{props.maxLTV} %</Text>
          </VStack>
        </Box>
      </VStack>
    </Center>
  );
};

export default DepositOverview;

const IconQuestion: React.FC<{
  onClick: React.MouseEventHandler;
}> = ({ onClick }) => {
  return (
    <Circle
      borderWidth={{ base: "1px", md: "2px" }}
      width={{ base: "10px", md: "15px" }}
      height={15}
      minHeight={{ base: "10px", md: "15px" }}
      ml={3}
      boxSizing="content-box"
      as={Center}
      fontSize={{ base: ".85rem", md: "1rem" }}
      color="yellow.100"
      borderColor="yellow.100"
      cursor="pointer"
      onClick={onClick}
    >
      ?
    </Circle>
  );
};
