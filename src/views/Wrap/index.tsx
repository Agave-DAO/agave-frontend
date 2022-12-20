import React, { useEffect, useState } from "react";
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
    Tooltip,
    Input,
    NumberInput,
    NumberInputField,
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
import { TokenIcon, useNativeSymbols } from "../../utils/icons";
import { stableValueHash } from "react-query/types/core/utils";



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
            balance="0"
            outerType={outerType}
            innerType="from"
            isModalTrigger={true}
            onClick={() =>{}}
          />
          <InnerBox
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
    balance: string;
    innerType: string; // from, to
    outerType: string; // wrap, unwrap
    isModalTrigger?: boolean;
    onClick: React.MouseEventHandler;
    buttonOverrideContent?: React.ReactNode | undefined;
}> = ({
    balance,
    innerType,
    outerType,
    onClick,
    isModalTrigger,
    buttonOverrideContent,
}) => {

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

    const { isOpen, onOpen, onClose } = useDisclosure();
    const balanceToWrapChange = (e:any) => e.target.value?setBalanceToWrap(e.target.value):'';
    const balanceToUnwrapChange = (e:any) => e.target.value?setBalanceToUnwrap(e.target.value):'';
    const [ tokenToWrap, setTokenToWrap ] = useState('');
    const [ tokenToUnwrap, setTokenToUnwrap ] = useState('');
    const [ balanceToWrap, setBalanceToWrap ] = useState(0);
    const [ balanceToUnwrap, setBalanceToUnwrap ] = useState(0);
    const [ maxBalanceToWrap, setMaxBalanceToWrap ] = useState(0);
    const [ maxBalanceToUnwrap, setMaxBalanceToUnwrap ] = useState(0);
    const [ toWrapButtonText, setToWrapButtonText ] = useState<any>('Select token');
    const [ toUnwrapButtonText, setToUnwrapButtonText ] = useState<any>('Select token');
    const [ wrappedButtonText, setWrappedButtonText ] = useState<any>('Wrapped token');
    const [ unwrappedButtonText, setUnwrappedButtonText ] = useState<any>('Unwrapped token');
    const maxDecimalsToDisplay = 5;
    
    useEffect(() => {
        if (tokenToWrap=='') {
            setToWrapButtonText("Select token");
            setMaxBalanceToWrap(0);
        } else {
            setBalanceToWrap(0);
            setToWrapButtonText(
                <HStack>
                    <TokenIcon 
                        symbol={tokenToWrap} 
                        width="8" 
                        height="8"
                        mt="-1px"
                    />
                    <Text 
                        width="100%"
                        textAlign="left"
                        marginX="8px"
                    >
                        {tokenToWrap}
                    </Text>
                </HStack>
            )
            setMaxBalanceToWrap(Number(bigNumberToString(balances[tokenToWrap].data, maxDecimalsToDisplay, decimals[tokenToWrap].data)));
        };
        onClose();
    }, [tokenToWrap]);

    useEffect(() => {
        if (tokenToUnwrap=='') {
            setToUnwrapButtonText("Select token");
            setMaxBalanceToUnwrap(0);
        } else {
            setBalanceToUnwrap(0);
            setToUnwrapButtonText(
                <HStack>
                    <TokenIcon 
                        symbol={tokenToUnwrap} 
                        width="8" 
                        height="8"
                        mt="-1px"
                    />
                    <Text 
                        width="100%"
                        textAlign="left"
                        marginX="8px"
                    >
                        {tokenToUnwrap}
                    </Text>
                </HStack>
            )
            setMaxBalanceToUnwrap(Number(bigNumberToString(balances[tokenToUnwrap].data, maxDecimalsToDisplay, decimals[tokenToUnwrap].data)));
        };
        onClose();        
    }, [tokenToUnwrap]);

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
                    className={innerType+"-"+outerType}
                    color={innerType=="from"?"white":"var(--chakra-colors-primary-900)"}
                    fontSize={{ base: "1.3rem", md: fontSizes.md }}
                    fontWeight="normal"
                    border={innerType=="to"?"2px solid var(--chakra-colors-primary-900)":""}
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
                    { innerType=="from"?( 
                        outerType=="wrap"?toWrapButtonText:toUnwrapButtonText
                    ):(
                        outerType=="wrap"?wrappedButtonText:unwrappedButtonText
                    )}
                </Button>
            </VStack>

            <VStack>
                <HStack>
                    <NumberInput
                        // TODO NEXT: handle keypress of . and 0
                        min={0}
                        max={outerType=="wrap"?maxBalanceToWrap:maxBalanceToUnwrap}
                        keepWithinRange={true}
                        type="number"
                        value={outerType=="wrap"?balanceToWrap:balanceToUnwrap}
                        onChange={(valueString) => (outerType=="wrap"?setBalanceToWrap(Number(valueString)):setBalanceToUnwrap(Number(valueString)))}
                    >
                        <NumberInputField 
                            fontSize={{ base:"20px", sm:"25px"}}
                            height="27px"
                            padding="0"
                            rounded="0s"
                            border="0"
                            _focus={{ boxShadow:"0"}}
                            borderBottom="1px solid var(--chakra-colors-primary-900)"
                            _hover={{borderBottom: "1px solid var(--chakra-colors-primary-900)"}}
                            boxShadow="0 !important"
                            disabled={outerType=="wrap"?(tokenToWrap==''|| innerType=="to"):(tokenToUnwrap=='' || innerType=="to")}
                        />
                    </NumberInput>
                    <Button
                            color="white"
                            fontSize={{ base: "1rem", md: fontSizes.sm }}
                            fontWeight="normal"
                            bg="primary.300"
                            disabled={outerType=="wrap"?(maxBalanceToWrap==0):(maxBalanceToUnwrap==0)}
                            height="auto"
                            py="3px"
                            marginBottom="-8px !important"
                            onClick={()=>{outerType=="wrap"?setBalanceToWrap(maxBalanceToWrap):setBalanceToUnwrap(maxBalanceToUnwrap)}}
                            _hover={{bgColor: innerType=="from"?"primary.900":"" }}
                            _active={{bgColor: innerType=="from"?"primary.900":"" }}
                        >
                            MAX
                    </Button>
                </HStack>



                {innerType=="from"?(
                    <HStack
                        width="100%"
                    >
                        <Text
                            opacity={(outerType=="wrap"&&tokenToWrap!="") || (outerType=="unwrap"&&tokenToUnwrap!="")?"1":"0.3"}
                            fontSize="1.32rem"
                            color="white"
                        >
                            Available: {outerType=="wrap"?maxBalanceToWrap.toString():maxBalanceToUnwrap.toString()} {outerType=="wrap"?tokenToWrap:tokenToUnwrap}
                        </Text>
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
                    setTokenToWrap={setTokenToWrap}
                    setTokenToUnwrap={setTokenToUnwrap}
                    onClose={onClose}
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
                        outerType=="wrap"?setTokenToWrap(''):setTokenToUnwrap('');
                        onClose();
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



const TokenListBox: React.FC<{ 
    outerType: string; // wrap, unwrap
    setTokenToWrap: any;
    setTokenToUnwrap: any;
    onClose:any;
} & CenterProps> = ({
    outerType,
    setTokenToWrap,
    setTokenToUnwrap,
    onClose,
    children,
    ...props
}) => {

    const toWrapList = ['WXDAI', 'USDC', 'LINK', 'GNO', 'FOX', 'USDT', 'WETH', 'WBTC'];
    const toUnwrapList = ['agWXDAI', 'agUSDC', 'agLINK', 'agGNO', 'agFOX', 'agUSDT', 'agWETH', 'agWBTC'];

    const tokenList = (outerType=='wrap')?toWrapList:toUnwrapList;

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
                            outerType=="wrap"?setTokenToWrap(tkn):setTokenToUnwrap(tkn);
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

export const Wrap: React.FC<IWrap> = () => {
    return React.useMemo(() => (
        <WrapLayout />
    ),[]);
};

