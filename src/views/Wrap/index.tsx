import React, { useEffect, useState, useMemo, useRef, ReactNode } from "react";
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
    InputProps,
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
import { BigNumber, FixedNumber } from "ethers";
import { bigNumberToString } from "../../utils/fixedPoint";
import { TokenIcon, useNativeSymbols } from "../../utils/icons";
import { stableValueHash } from "react-query/types/core/utils";
import { BigNumberish, parseFixed } from "@ethersproject/bignumber";



export interface IWrap {}

export interface ITextInput extends InputProps {
    innerType: string,
    outerType: string,
    token: string,
    toTextColor: string
}

export interface RawInputProps {
    value: string;
    setValue: (newRawAmount: string) => void;
    error?: boolean | undefined;
    helperText?: string | undefined;
}

export interface AmountInputProps {
    amount: BigNumber | undefined;
    decimals: number;
    setAmount: (newValue: BigNumber | undefined) => void;
    minAmount?: BigNumber | undefined;
    maxAmount?: BigNumber | undefined;
    children: (
      rawInputProps: RawInputProps
    ) => React.ReactElement<any, any> | null;
}

// Equate (BigNumber | undefined) instances with eachother
function eqBigNumberOptions(
    a: BigNumber | undefined,
    b: BigNumber | undefined
): boolean {
    return !(a !== b && (a === undefined || b === undefined || !a.eq(b)));
}

function clampBigNumber(
    value: BigNumberish,
    minAmount: BigNumber | undefined,
    maxAmount: BigNumber | undefined
): BigNumber {
    if (value == null) {
      return value;
    }
    if (maxAmount && maxAmount.lt(value)) {
      return maxAmount;
    }
    if (minAmount && minAmount.gt(value)) {
      return minAmount;
    }
    return BigNumber.from(value);
}

function balanceAsText(balance:BigNumber,decimals:BigNumber) {
    return FixedNumber.fromValue(balance, decimals)
    .toString()
    .slice(0, ((FixedNumber.fromValue(balance, decimals).toString().indexOf(".") == 1) ? 8 : FixedNumber.fromValue(balance, decimals).toString().indexOf(".")+3))
}

const TextInput: React.FC<ITextInput> = props => {
    return (
      <Input
        fontSize={{ base:"20px", sm:"25px"}}
        height="27px"
        padding="0"
        rounded="0s"
        border="0"
        color={props.innerType=="from"?"white":props.toTextColor}
        _focus={{ boxShadow:"0"}}
        borderBottom={props.innerType=="from"?"1px solid var(--chakra-colors-primary-900)":"0"}
        _hover={{borderBottom: props.innerType=="from"?"1px solid var(--chakra-colors-primary-900)":"0"}}
        boxShadow="0 !important"
        disabled={props.token=='' || props.innerType=='to'}
        _disabled={{opacity:(props.token!=''&&props.token!=='ag'?"1":"0.4")}}
        opacity={props.innerType=="to"?"0.7":"1"}
        {...props}
      />
    );
  };

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
    outerType: "wrap" | "unwrap";
} & CenterProps> = ({
    outerType,
    children,
    ...props
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
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

    const [ tokenToWrap, setTokenToWrap ] = useState('');
    const [ tokenToUnwrap, setTokenToUnwrap ] = useState('');
    const [ balanceToWrap, setBalanceToWrap ] = useState<BigNumber | undefined>(BigNumber.from(0));
    const [ balanceToUnwrap, setBalanceToUnwrap ] = useState<BigNumber | undefined>(BigNumber.from(0));
    const [ maxBalanceToWrap, setMaxBalanceToWrap ] = useState<BigNumber | undefined>(BigNumber.from(0));
    const [ maxBalanceToUnwrap, setMaxBalanceToUnwrap ] = useState<BigNumber | undefined>(BigNumber.from(0));
    const [ toWrapButtonText, setToWrapButtonText ] = useState<any>('Select token');
    const [ toUnwrapButtonText, setToUnwrapButtonText ] = useState<any>('Select token');
    const [ wrappedButtonText, setWrappedButtonText ] = useState<any>('');
    const [ unwrappedButtonText, setUnwrappedButtonText ] = useState<any>('');
    const [ tokenToWrapDecimals, setTokenToWrapDecimals ] = useState(0);
    const [ tokenToUnwrapDecimals, setTokenToUnwrapDecimals ] = useState(0);

    const maxDecimalsToDisplay = 5;
    const toTextColor = "white";

    

    useEffect(() => {
       console.log(decimals);
      if (tokenToWrap=='') {
          setToWrapButtonText("Select token");
          setWrappedButtonText("");
          setMaxBalanceToWrap(BigNumber.from(0));
          setBalanceToWrap(BigNumber.from(0));
          setTokenToWrapDecimals(0);
      } else {
          setBalanceToWrap(BigNumber.from(0));
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
                      fontSize="15px"
                  >
                      {tokenToWrap}
                  </Text>
              </HStack>
          );
          setWrappedButtonText(
              <HStack>
                  <TokenIcon 
                      symbol={"ag"+tokenToWrap} 
                      width="8" 
                      height="8"
                      mt="-1px"
                  />
                  <Text 
                      width="100%"
                      textAlign="left"
                      marginX="8px"
                      fontSize="15px"
                      color={toTextColor}
                  >
                      {"ag"+tokenToWrap}
                  </Text>
              </HStack>
          );
          setMaxBalanceToWrap(balances[tokenToWrap].data);
          setTokenToWrapDecimals(decimals[tokenToWrap].data);
      };
      onClose();
  }, [tokenToWrap]);

  useEffect(() => {
      if (tokenToUnwrap=='') {
          setToUnwrapButtonText("Select token");
          setUnwrappedButtonText("");
          setMaxBalanceToUnwrap(BigNumber.from(0));
          setBalanceToUnwrap(BigNumber.from(0));
          setTokenToUnwrapDecimals(0);
      } else {
          setBalanceToUnwrap(BigNumber.from(0));
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
                      fontSize="15px"
                  >
                      {tokenToUnwrap}
                  </Text>
              </HStack>
          );
          setUnwrappedButtonText(
              <HStack>
                  <TokenIcon 
                      symbol={tokenToUnwrap.substring(2)} 
                      width="8" 
                      height="8"
                      mt="-1px"
                  />
                  <Text 
                      width="100%"
                      textAlign="left"
                      marginX="8px"
                      fontSize="15px"
                      color={toTextColor}
                  >
                      {tokenToUnwrap.substring(2)}
                  </Text>
              </HStack>
          );
          setMaxBalanceToUnwrap(balances[tokenToUnwrap].data);
          setTokenToUnwrapDecimals(decimals[tokenToUnwrap].data);
      };
      onClose();
  }, [tokenToUnwrap]);

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
            token={outerType=="wrap"?tokenToWrap:tokenToUnwrap}
            setToken={outerType=="wrap"?setTokenToWrap:setTokenToUnwrap}
            balance={outerType=="wrap"?balanceToWrap:balanceToUnwrap}
            maxBalance={outerType=="wrap"?maxBalanceToWrap:maxBalanceToUnwrap}
            setBalance={outerType=="wrap"?setBalanceToWrap:setBalanceToUnwrap}
            buttonText={outerType=="wrap"?toWrapButtonText:toUnwrapButtonText}
            maxDecimalsToDisplay={maxDecimalsToDisplay}
            tokenDecimals={tokenToWrapDecimals}
            toTextColor={toTextColor}
            outerType={outerType}
            innerType="from"
            isModalTrigger={true}
            onClick={() =>{}}
          />
          <InnerBox
            token={outerType=="wrap"?'ag'+tokenToWrap:tokenToUnwrap.substring(2)}
            setToken={undefined}
            balance={outerType=="wrap"?balanceToWrap:balanceToUnwrap}
            maxBalance={BigNumber.from(0)}
            setBalance={outerType=="wrap"?setBalanceToWrap:setBalanceToUnwrap}
            buttonText={outerType=="wrap"?wrappedButtonText:unwrappedButtonText}
            maxDecimalsToDisplay={maxDecimalsToDisplay}
            tokenDecimals={tokenToWrapDecimals}
            toTextColor={toTextColor}
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
    balance: BigNumber | undefined,
    maxBalance: BigNumber | undefined,
    setBalance: (newValue: BigNumber | undefined) => void,
    token: string;
    setToken: any,
    buttonText: string | ReactNode | undefined;
    innerType: "from" | "to";
    outerType: "wrap" | "unwrap";
    maxDecimalsToDisplay: number;
    tokenDecimals: number;
    toTextColor: string;
    isModalTrigger?: boolean;
    onClick: React.MouseEventHandler;
}> = ({
    balance,
    maxBalance,
    setBalance,
    token,
    setToken,
    buttonText,
    innerType,
    outerType,
    maxDecimalsToDisplay,
    tokenDecimals,
    toTextColor,
    onClick,
    isModalTrigger,
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
                    opacity={outerType=="wrap"?"1 !important":""}
                >
                    {buttonText}

                </Button>
            </VStack>

            <VStack>
                <HStack>
                    <AmountField 
                      amount={balance}
                      setAmount={setBalance}
                      maxAmount={maxBalance}
                      minAmount={BigNumber.from(0)}
                      decimals={tokenDecimals}
                    >
                        {({ value, setValue, error }) => (
                            <TextInput
                            value={value}
                            onChange={ev => setValue(ev.target.value)}
                            isInvalid={error !== undefined}
                            innerType={innerType}
                            outerType={outerType}
                            toTextColor={toTextColor}
                            token={token}
                            />
                        )}                        
                    </AmountField>
                    

                    

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
                            Available: {maxBalance?balanceAsText(maxBalance,BigNumber.from(tokenDecimals)):"0"}
                        </Text>


                        {innerType=="from"?(
                            <Button
                                    color="white"
                                    fontSize={{ base: "1rem", md: fontSizes.sm }}
                                    fontWeight="normal"
                                    bg="primary.300"
                                    disabled={maxBalance==BigNumber.from(0)}
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
                        setToken('');
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

const AmountField: React.FC<AmountInputProps> = ({
    amount,
    decimals,
    setAmount,
    maxAmount,
    minAmount,
    children,
}) => {  
    const [state, setState] = useState({
        baked: amount,
        raw: amount ? FixedNumber.fromValue(amount, decimals).toString() : "",
        err: undefined as string | undefined,
    });

    useEffect(() => {
        if (!eqBigNumberOptions(amount, state.baked)) {
          setState({
            baked: amount,
            raw:
              amount !== undefined
                ? FixedNumber.fromValue(amount, decimals).toString()
                : state.raw,
            err: state.err,
          });
        }
      }, [state.raw, state.baked, state.err, amount, decimals]);

    const updateRawAmount = useMemo(
        () => (newValue: string) => {
            const preparse = newValue.trim();
            let parsedAmount: BigNumber;
            try {
              parsedAmount = parseFixed(preparse, decimals);

              if (maxAmount && parsedAmount.gt(maxAmount)) {
                parsedAmount = maxAmount;
                throw true;
              }

              
            } catch {
              setState({
                baked: undefined,
                raw: preparse,
                err: "Invalid input",
              });
              if (amount !== undefined) {
                setAmount(undefined);
              }
              return;
            }
            setState({
              baked: parsedAmount,
              raw: preparse,
              err: undefined,
            });
            if (amount === undefined || amount?.eq(parsedAmount) === false) {
              setAmount(parsedAmount);
            }
          },
          [setState, setAmount, minAmount, maxAmount, decimals, amount]
    );

    return useMemo(
        () =>
          children({
            value: state.raw,
            setValue: updateRawAmount,
            error: state.err !== undefined ? true : undefined,
            helperText: state.err,
          }),
        [state.raw, state.err, updateRawAmount, children]
    );


};

const TokenListBox: React.FC<{ 
    outerType: string; // wrap, unwrap
    setToken: any;
    onClose:any;
} & CenterProps> = ({
    outerType,
    setToken,
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

export const Wrap: React.FC<IWrap> = () => {
    return React.useMemo(() => (
        <WrapLayout />
    ),[]);
};

