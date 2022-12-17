import React from "react";
import { 
    Box, 
    Center, 
    Text, 
    Flex, 
    VStack, 
    StackDivider, 
    Spinner, 
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input
} from "@chakra-ui/react";
import { CenterProps, HStack } from "@chakra-ui/layout";
import { isMobileOnly, isMobile } from "react-device-detect";
import { useDisclosure } from "@chakra-ui/hooks";
import ColoredText from "../../components/ColoredText";
import { ModalIcon } from "../../utils/icons";
import { fontSizes, spacings } from "../../utils/constants";
import { useUserAssetBalance } from "../../queries/userAssets";
import { tokenDecimals } from "../../queries/tokenDecimals";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { externalAddresses } from "../../utils/contracts/contractAddresses/externalAdresses";
import { BigNumber } from "ethers";
import { bigNumberToString } from "../../utils/fixedPoint";

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



const OuterBox: React.FC<{
    outerType: string; // wrap, unwrap
} & CenterProps> = ({
    outerType,
    children,
    ...props
}) => {
    return (
      <Center
        boxSizing="content-box"
        flexDirection="column"
        rounded="xl"
        textAlign="center"
        minH="10.6rem"
        mb="5"
        minW={{ base: "100%", lg: "auto" }}
        flex={1}
        bg="primary.900"
        py="1rem"
        {...props}
      >
        <VStack
          spacing={4}
          w="90%"
          align="center"
          flexDirection="column"
        >
          <ColoredText
            fontSize="1.8rem"
          >
            {outerType=="wrap"?"Wrap tokens":"Unwrap tokens"}
          </ColoredText>
          <InnerBox
            tokenAmount=""
            balance="0"
            outerType={outerType}
            innerType="from"
            isModalTrigger={true}
            onClick={() =>{}}
          />
          <InnerBox
            tokenAmount=""
            balance="0"
            outerType={outerType}
            innerType="to"
            isModalTrigger={false}
            onClick={() =>{}}
          />
          <Button
            width="30%"
            mt="2.4rem"
            textTransform="uppercase"
            background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
            color="secondary.900"
            fontWeight="bold"
            px={{ base: "10rem", md: "6rem" }}
            py="1.5rem"
            fontSize={fontSizes.md}
            disabled={true}
           >
            {outerType=="wrap"?"Wrap":"Unwrap"}
          </Button>
        </VStack>
      </Center>
    );
};

const InnerBox: React.FC<{
    tokenAmount: string;
    balance: string;
    innerType: string; // from, to
    outerType: string; // wrap, unwrap
    isModalTrigger?: boolean;
    onClick: React.MouseEventHandler;
    buttonOverrideContent?: React.ReactNode | undefined;
}> = ({
    tokenAmount,
    balance,
    innerType,
    outerType,
    onClick,
    isModalTrigger,
    buttonOverrideContent,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
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
        <HStack spacing="1rem" mr="1rem" height="100%">
            <VStack
                spacing={4}
                w="90%"
                align="stretch"
                textAlign="left"
                flexDirection="column"
            >
                <Input
                    type="text"
                    fontSize="40"
                    maxWidth="100px"
                    height="50px"
                    rounded="0s"
                    border="0"
                    borderBottom="1px solid var(--chakra-colors-primary-900)"
                    placeholder="0"
                    defaultValue={tokenAmount}
                />

                {innerType=="from"?
                    <Button
                        color="white"
                        fontSize={{ base: "1rem", md: fontSizes.sm }}
                        fontWeight="normal"
                        bg="primary.300"
                        alignSelf="flex-start"
                        disabled={true}
                        height="auto"
                        py="3px"
                    >
                        MAX
                    </Button>
                :""}
            </VStack>
            <VStack
                spacing={4}
                w="90%"
                align="stretch"
                textAlign="right"
                flexDirection="column"
            >
                {buttonOverrideContent === undefined ? (
                    <Button
                        color="white"
                        fontSize={{ base: "1rem", md: fontSizes.md }}
                        fontWeight="normal"
                        bg="primary.300"
                        py="1.6rem"
                        my="1.2rem"
                        alignSelf="flex-end"
                        px={{ base: "5%", md: "2.171rem" }}
                        disabled={innerType=="to"}
                        onClick={onOpen}
                    >
                        {innerType=="from"?"Select token":(outerType=="wrap"?"Wrapped token":"Unwrapped token")}
                    </Button>
                ) : (
                 <>{buttonOverrideContent}</>
                )}
                
            </VStack>
        </HStack>

        {isModalTrigger && (
            
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent
                color="primary.900"
                bg="linear-gradient(180deg, #F3FFF7 8.89%, #DCFFF1 146.53%)"
                px={{ base: "1.5rem", md: "2.9rem" }}
                py="3.5rem"
                rounded="lg"
                minW={{ base: "80%", md: "30vw" }}
                minH={{ base: "50%", md: "30vh" }}
            >
                <TokenListBox 
                    outerType={outerType} 
                />

                <ModalFooter>
                <Button
                    w={{ base: "100%", md: "60%" }}
                    m="auto"
                    py="1.5rem"
                    fontSize={{ base: "1.6rem", md: fontSizes.md }}
                    bg="secondary.100"
                    color="white"
                    fontWeight="normal"
                    onClick={onClose}
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



const TokenListBox: React.FC<{ 
    outerType: string; // wrap, unwrap
} & CenterProps> = ({
    outerType,
    children,
    ...props
}) => {

    const toWrapList = ['WXDAI', 'USDC', 'LINK', 'GNO', 'FOX', 'USDT', 'WETH', 'WBTC'];
    const toUnwrapList = ['agWXDAI', 'agUSDC', 'agLINK', 'agGNO', 'agFOX', 'agUSDT', 'agWETH', 'agWBTC'];

    const tokenList = (outerType=='wrap')?toWrapList:toUnwrapList;

    const balances:any = {
        'WXDAI': useUserAssetBalance(externalAddresses.WXDAI),
        'USDC': useUserAssetBalance(externalAddresses.USDC),
        'LINK': useUserAssetBalance(externalAddresses.LINK),
        'GNO': useUserAssetBalance(externalAddresses.GNO),
        'FOX': useUserAssetBalance(externalAddresses.FOX),
        'USDT': useUserAssetBalance(externalAddresses.USDT),
        'WETH': useUserAssetBalance(externalAddresses.WETH),
        'WBTC': useUserAssetBalance(externalAddresses.WBTC),

        'agWXDAI': useUserAssetBalance(externalAddresses.agWXDAI),
        'agUSDC': useUserAssetBalance(externalAddresses.agUSDC),
        'agLINK': useUserAssetBalance(externalAddresses.agLINK),
        'agGNO': useUserAssetBalance(externalAddresses.agGNO),
        'agFOX': useUserAssetBalance(externalAddresses.agFOX),
        'agUSDT': useUserAssetBalance(externalAddresses.agUSDT),
        'agWETH': useUserAssetBalance(externalAddresses.agWETH),
        'agWBTC': useUserAssetBalance(externalAddresses.agWBTC),
    };

    const decimals:any = {
        'WXDAI': tokenDecimals(externalAddresses.WXDAI),
        'USDC': tokenDecimals(externalAddresses.USDC),
        'LINK': tokenDecimals(externalAddresses.LINK),
        'GNO': tokenDecimals(externalAddresses.GNO),
        'FOX': tokenDecimals(externalAddresses.FOX),
        'USDT': tokenDecimals(externalAddresses.USDT),
        'WETH': tokenDecimals(externalAddresses.WETH),
        'WBTC': tokenDecimals(externalAddresses.WBTC),

        'agWXDAI': tokenDecimals(externalAddresses.agWXDAI),
        'agUSDC': tokenDecimals(externalAddresses.agUSDC),
        'agLINK': tokenDecimals(externalAddresses.agLINK),
        'agGNO': tokenDecimals(externalAddresses.agGNO),
        'agFOX': tokenDecimals(externalAddresses.agFOX),
        'agUSDT': tokenDecimals(externalAddresses.agUSDT),
        'agWETH': tokenDecimals(externalAddresses.agWETH),
        'agWBTC': tokenDecimals(externalAddresses.agWBTC),
    }

    console.log(decimals);

    return (
        <Center>
            <VStack width="100%">
                {tokenList.map(x => 
                    <HStack 
                        width="100%"
                    >
                        <Box
                            background="secondary.900"
                            color="white"
                            roundedLeft="5"
                            width="50%"
                            mr="-3px"
                            textAlign="right"
                            padding="2px"
                            pr="10px"
                        >
                            {x}
                        </Box>

                        <Box
                            background="primary.900"
                            color="white"
                            roundedRight="5"
                            width="50%"
                            padding="2px"
                            pl="10px"
                        >
                            {balances[x].data&&decimals[x]?bigNumberToString(balances[x].data, 2, decimals[x].data):<Spinner speed="0.5s" emptyColor="gray.200" color="yellow.500"/>}
                        </Box>
                    </HStack>
                )}
            </VStack>
        </Center>
    );
};

export const Wrap: React.FC<IWrap> = () => {
    return React.useMemo(() => (
        <WrapLayout />
    ),[]);
};

