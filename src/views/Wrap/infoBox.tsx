import React, { useMemo,ReactNode } from "react";
import { Box, Center, Text, VStack, Button, Modal, ModalOverlay, ModalContent, ModalFooter, Spinner, Input, InputProps } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { fontSizes, spacings } from "../../utils/constants";
import { BigNumber, FixedNumber } from "ethers";
import { TokenListBox } from "./tokenListBox";
import { AmountField } from "./amountField";

export const InfoBox: React.FC<{
    balance: BigNumber | undefined,
    buttonTextFrom: string | ReactNode | undefined;
    buttonTextTo: string | ReactNode | undefined;
    outerType: "wrap" | "unwrap";
    decimals: number;
}> = ({
    balance,
    buttonTextFrom,
    buttonTextTo,
    outerType,
    decimals,
}) => {

    function balanceAsText(balance:BigNumber,decimals:BigNumber) {
        return FixedNumber.fromValue(balance, decimals)
        .toString()
        .slice(0, ((FixedNumber.fromValue(balance, decimals).toString().indexOf(".") == 1) ? 20 : FixedNumber.fromValue(balance, decimals).toString().indexOf(".")+3))
    }

    return (
      <Box
        w="100%"
        maxW="100%"
        px={{ base: "1.1rem", md: "2.2rem" }}
        py={{ base: spacings.md, md: "1.5rem" }}
        bg="secondary.900"
        rounded="2xl"
        position="relative"
        minW="40%"
        mx={{ base: "0.5rem", md: "1rem" }}
        my="1rem"
        align="center"
      >
        <Center>
            <VStack spacing="1rem" mr="1rem" height="100%">
                <HStack>
                    <Box
                        key={"left_box_"+outerType}
                        color="white"
                        fontSize={{ base: "1.3rem", md: fontSizes.md }}
                        fontWeight="normal"
                        verticalAlign="top"
                        width="140px"
                        minWidth="120px"
                        alignSelf="flex-end"
                        px={{ base: "5%", md: "2.171rem" }}
                        bgColor="secondary.900"
                        opacity="1 !important"
                    >
                        {buttonTextFrom}
                    </Box>

                    <Box 
                        color="primary.900" 
                        fontWeight="bold"
                    >
                        ⇒
                    </Box>
                    
                    <Box
                        key={"left_box_"+outerType}
                        color="white"
                        fontSize={{ base: "1.3rem", md: fontSizes.md }}
                        fontWeight="normal"
                        verticalAlign="top"
                        width="140px"
                        minWidth="120px"
                        alignSelf="flex-end"
                        px={{ base: "5%", md: "2.171rem" }}
                        bgColor="secondary.900"
                        opacity="1 !important"
                    >
                        {buttonTextTo}
                    </Box>
                </HStack>

                <HStack>
                    <Center>
                        <Text fontWeight="bold">
                            {balance?balanceAsText(balance,BigNumber.from(decimals)):"0.0"}
                        </Text>
                    </Center>
                </HStack>


            </VStack>
        </Center>
      </Box>
    );
};
