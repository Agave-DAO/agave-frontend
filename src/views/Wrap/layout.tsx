import React from "react";
import { Box, Center, Text, Flex } from "@chakra-ui/react";
import { isMobileOnly } from "react-device-detect";
import { OuterBox } from "./outerBox";

export interface IWrap {
  tokenBalances: any;
}

const tokenDecimals = {
  'agWXDAI': 18,
  'agUSDC': 6,
  'agUSDT': 6,
  'agGNO': 18,
  'agWETH': 18,
  'agWBTC': 8,
  'cagWXDAI': 18,
  'cagUSDC': 6,
  'cagUSDT': 6,
  'cagGNO': 18,
  'cagWETH': 18,
  'cagWBTC': 8
};

const tokens = [
  // unwrapped, wrapped
  ['agWXDAI', 'cagWXDAI'],
  ['agUSDC', 'cagUSDC'],
  ['agGNO', 'cagGNO'],
  ['agUSDT', 'cagUSDT'],
  ['agWETH', 'cagWETH'],
  ['agWBTC', 'cagWBTC'],
]

export const WrapBanner: React.FC<{}> = () => {
    return (
        <Box w="100%">
        {!isMobileOnly && (
          <Center width="100%" justifyContent="space-between">
            <Text
              fontWeight="bold"
              color="white"
              fontSize={{ base: "1.8rem", md: "2.4rem" }}
            >
              Wrap tokens
            </Text>
          </Center>
        )}
      </Box>
    );
}

export const WrapLayout: React.FC<IWrap> = ({
  tokenBalances
}) => {

  return (
    <Flex 
      flexDirection="column"
      alignItems="stretch"
    >
      <Flex
        justifyContent="flex-start"
        flexBasis="auto"
        spacing="1em"
        w="100%"
        flexDirection={{ base: "column", lg: "row" }}
        m="auto"
        color="white"
      >
        <OuterBox
          outerType="wrap"
          tokenBalances={tokenBalances}
          tokenDecimals={tokenDecimals}
          tokens={tokens}
          mr={{ base: "inherit", lg: "1%" }}
        >
        </OuterBox>

        <OuterBox
          outerType="unwrap"
          tokenBalances={tokenBalances}
          tokenDecimals={tokenDecimals}
          tokens={tokens}
          ml={{ base: "inherit", lg: "1%" }}
        >
        </OuterBox>

      </Flex>
    </Flex>
  )
}