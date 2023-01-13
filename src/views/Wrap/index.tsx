import React, { useEffect } from "react";
import { Box, Center, Text, Flex } from "@chakra-ui/react";
import { isMobileOnly} from "react-device-detect";
import { BigNumber, BigNumberish } from "ethers";
import { userTokenBalances } from "../../queries/userTokenBalances";
import { WrapLayout } from "./layout";

export interface IWrap {
  tokenBalances: any;
}

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

export const Wrap: React.FC<IWrap> = () => {
  const tokenBalances = userTokenBalances();
  return (
      <WrapLayout
        tokenBalances={tokenBalances}
      />
  );
};

