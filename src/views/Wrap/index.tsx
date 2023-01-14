import React, { useEffect } from "react";
import { Box, Center, Text, Flex, Image } from "@chakra-ui/react";
import { isMobileOnly} from "react-device-detect";
import { BigNumber, BigNumberish } from "ethers";
import { userTokenBalances } from "../../queries/userTokenBalances";
import { WrapLayout } from "./layout";
import loadingImg from "../../assets/image/loading.svg";
import { fontSizes } from "../../utils/constants";

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

const LoadingLayout: React.FC<{}> = () => {
  return (
    <Center
    w={ "100%"}
    boxSizing="content-box"
    flexDirection="column"
    rounded="xl"
    float="left"
    minH="20rem"
    px={{ base: "0rem", md: "0rem" }}
    py="2.4rem"
    >

      <Image src={loadingImg} boxSize="2.5rem" />

  </Center>
  );
}

export const Wrap: React.FC<IWrap> = () => {
  const { data: tokenBalances } = userTokenBalances();
  return React.useMemo(
    () => (
      <WrapLayout
        tokenBalances={tokenBalances}
      />
    ), [tokenBalances]
  );
};




