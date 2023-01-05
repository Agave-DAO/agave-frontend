import React, { useMemo } from "react";
import { Box, Center, Text, Flex } from "@chakra-ui/react";
import { isMobileOnly} from "react-device-detect";
import { OuterBox } from "./outerBox";

export interface IWrap {}

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

export const WrapLayout: React.FC<{}> = () => {
    return (
      <Flex flexDirection="column">
        <Flex
          align="center"
          flexBasis="auto"
          spacing="1em"
          w="100%"
          flexDirection={{ base: "column", lg: "row" }}
          m="auto"
          color="white"
        >
          <OuterBox
            outerType="wrap"
            mr={{ base: "inherit", lg: "1%" }}
          >
          </OuterBox>

          <OuterBox
            outerType="unwrap"
            ml={{ base: "inherit", lg: "1%" }}
          >
          </OuterBox>

        </Flex>
      </Flex>
    );
}

export const Wrap: React.FC<IWrap> = () => {
    return React.useMemo(() => (
        <WrapLayout />
    ),[]);
};

