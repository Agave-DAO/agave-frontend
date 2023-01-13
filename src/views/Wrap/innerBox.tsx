import React, { useMemo,ReactNode } from "react";
import { Box, Center, Text, VStack, Button, Modal, ModalOverlay, ModalContent, ModalFooter, Spinner, Input, InputProps } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { fontSizes, spacings } from "../../utils/constants";
import { BigNumber, FixedNumber } from "ethers";
import { TokenListBox } from "./tokenListBox";
import { AmountField } from "./amountField";

export const InnerBox: React.FC<{
    balance: BigNumber | undefined,
    maxBalance: BigNumber | undefined,
    setBalance: (newValue: BigNumber | undefined) => void,
    token: string;
    setToken: any,
    buttonText: string | ReactNode | undefined;
    innerType: "from" | "to";
    outerType: "wrap" | "unwrap";
    decimals: number;
    isModalTrigger?: boolean;
    onClick: React.MouseEventHandler;
    tokens: string[][];
    getTokenPair: any;
}> = ({
    balance,
    maxBalance,
    setBalance,
    token,
    setToken,
    buttonText,
    innerType,
    outerType,
    decimals,
    onClick,
    tokens,
    getTokenPair,
    isModalTrigger,
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();

    const [avaliableBalanceText, setAvailableBalanceText] = React.useState("0.0");

    React.useEffect(() => {
        const text = (
            maxBalance?(
                balanceAsText(maxBalance,BigNumber.from(decimals))
            ):(
                token!=""?(
                    "N/A"
                ):(
                    "0.0"
                )
            )
        );
        setAvailableBalanceText(text);
    }, [maxBalance, decimals]);

    function balanceAsText(balance:BigNumber,decimals:BigNumber) {
        return FixedNumber.fromValue(balance, decimals)
        .toString()
        .slice(0, ((FixedNumber.fromValue(balance, decimals).toString().indexOf(".") == 1) ? 8 : FixedNumber.fromValue(balance, decimals).toString().indexOf(".")+3))
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
                <Button
                    key={innerType+"-"+outerType}
                    color="white"
                    fontSize={{ base: "1.3rem", md: fontSizes.md }}
                    fontWeight="normal"
                    bg="primary.300"
                    py="1.6rem"
                    verticalAlign="top"
                    width="140px"
                    minWidth="120px"
                    alignSelf="flex-end"
                    px={{ base: "5%", md: "2.171rem" }}
                    onClick={onOpen}
                    bgColor={innerType=="to"?"secondary.900":""}
                    _hover={{bgColor: innerType=="from"?"primary.900":"" }}
                    _active={{bgColor: innerType=="from"?"primary.900":"" }}
                    disabled={innerType=="to"}
                    opacity="1 !important"
                >
                    {buttonText}
                </Button>
            </VStack>

            <VStack>
                <HStack>
                    <AmountField
                        balance={balance}
                        setBalance={setBalance}
                        maxBalance={maxBalance}
                        decimals={decimals}
                        innerType={innerType}
                        outerType={outerType}
                        token={token}
                    />
                </HStack>

                {innerType=="from"?(
                    <HStack
                        width="100%"
                    >
                        <Text
                            opacity={(token!="")?"0.8":"0.3"}
                            fontSize="1.32rem"
                            color="white"
                            textAlign="center"
                            width="100%"
                        >
                            Available: {avaliableBalanceText}
                        </Text>

                        {innerType=="from"?(
                            <Button
                                    color="white"
                                    fontSize={{ base: "1rem", md: fontSizes.sm }}
                                    fontWeight="normal"
                                    bg="primary.300"
                                    disabled={maxBalance==BigNumber.from(0) || token==''}
                                    height="auto"
                                    py="3px"
                                    onClick={()=>{setBalance(maxBalance)}}
                                    _hover={{bgColor: innerType=="from"?"primary.900":"" }}
                                    _active={{bgColor: innerType=="from"?"primary.900":"" }}
                                >
                                    MAX
                            </Button>
                        ):("")}
                    </HStack>
                ):(
                    ""
                )}
            </VStack>
        </Center>

        {isModalTrigger && (
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                color="primary.900"
                bg="linear-gradient(180deg, #F3FFF7 8.89%, #DCFFF1 146.53%)"
                px={{ base: "3rem", md: "3.9rem" }}
                py="2rem"
                rounded="lg"
                border="5px double #044d44"
                minH={{ base: "50%", md: "30vh" }}
            >
                <TokenListBox 
                    outerType={outerType} 
                    setToken={setToken}
                    getTokenPair={getTokenPair}
                    onClose={onClose}
                    tokens={tokens}
                    setBalance={setBalance}
                />
                <ModalFooter>
                <Button
                    w={{ base: "100%", md: "60%" }}
                    m="auto"
                    mt="20px"
                    py="1.5rem"
                    fontSize={{ base: "1.6rem", md: fontSizes.md }}
                    bg="secondary.100"
                    color="white"
                    fontWeight="normal"
                    onClick={() => {
                        setToken('');
                        onClose();
                        setBalance(BigNumber.from(0));
                    }}
                    _hover={{bgColor:"secondary.900"}}
                    _active={{bgColor:"secondary.900"}}
                >
                    Close
                </Button>
                </ModalFooter>
            </ModalContent>
            </Modal>
        )}
      </Box>
    );
};
