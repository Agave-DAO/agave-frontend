import React, { useMemo } from "react";
import { Box, Center, Text, VStack, StackDivider, Button } from "@chakra-ui/react";
import { CenterProps, HStack } from "@chakra-ui/layout";
import { TokenIcon } from "../../utils/icons";

export const TokenListBox: React.FC<{ 
    outerType: "wrap"|"unwrap";
    setToken: any;
    getTokenPair:any;
    onClose:any;
    tokens:string[][];
} & CenterProps> = ({
    outerType,
    setToken,
    getTokenPair,
    onClose,
    tokens,
    children,
    ...props
}) => {

    const tokenList = (outerType=='wrap')?tokens.map(x => x[0]):tokens.map(x => x[1]);

    return (
        <Center>
            <VStack 
                width="100%"
                divider = {<StackDivider margin="52px" />}
            >
                <Text>Select your token</Text>
                {tokenList.map(tkn => 
                    <Button
                        onClick={(e)=> {
                            setToken(tkn);
                            onClose(); 
                        }}
                        width="100%"
                        opacity="0.9"
                        _hover={{ opacity: "1" }}
                        cursor="pointer"
                        name={tkn}
                        fontWeight="normal"
                        padding="0"
                        border="0"
                        key={outerType+tkn}
                    >
                        <HStack 
                            width="100%"
                        >
                            <Box
                                background="secondary.900"
                                color="white"
                                rounded="5"
                                width="100%"
                                mr="-3px"
                                textAlign="right"
                                padding="2px"
                                pr="10px"
                            >
                                <HStack
                                    divider={
                                    <StackDivider
                                        borderColor="primary.900"
                                        h="2.5rem"
                                    />
                                    } 
                                >
                                    <TokenIcon 
                                        symbol={tkn} 
                                        width="8" 
                                        height="8"
                                        marginX="10px"
                                    />
                                    <Text 
                                        width="100%"
                                        textAlign="left"
                                        marginX="8px"
                                    >
                                        {tkn}
                                    </Text>
                                </HStack>
                            </Box>
                        </HStack>
                    </Button>
                )}
            </VStack>
        </Center>
    );
};