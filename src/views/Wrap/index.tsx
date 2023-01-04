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
import { useUserAssetBalance, useUserStableAndVariableDebtForAsset } from "../../queries/userAssets";
import { tokenDecimals } from "../../queries/tokenDecimals";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { externalAddresses } from "../../utils/contracts/contractAddresses/externalAdresses";
import { BigNumber, FixedNumber } from "ethers";
import { bigNumberToString } from "../../utils/fixedPoint";
import { TokenIcon, useNativeSymbols } from "../../utils/icons";
import { stableValueHash } from "react-query/types/core/utils";
import { BigNumberish, parseFixed } from "@ethersproject/bignumber";
import { useChainAddresses } from "../../utils/chainAddresses";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";
import { resourceLimits } from "worker_threads";


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

    const internalAddresses = internalAddressesPerNetwork.Gnosis;


    const [ balanceWXDAI, setbalanceWXDAI ] = useState<any>(useUserAssetBalance(internalAddresses.WXDAI));
    const [ balanceUSDC, setBalanceUSDC ] = useState<any>(useUserAssetBalance(internalAddresses.USDC));
    const [ balanceGNO, setBalanceGNO ] = useState<any>(useUserAssetBalance(internalAddresses.GNO));
    const [ balanceUSDT, setBalanceUSDT ] = useState<any>(useUserAssetBalance(internalAddresses.USDT));
    const [ balanceWETH, setBalanceWETH ] = useState<any>(useUserAssetBalance(internalAddresses.WETH));
    const [ balanceWBTC, setBalanceWBTC ] = useState<any>(useUserAssetBalance(internalAddresses.WBTC));

    const [ balanceAgWXDAI, setBalanceAgWXDAI ] = useState<any>(useUserAssetBalance(internalAddresses.agWXDAI));
    const [ balanceAgUSDC, setBalanceAgUSDC ] = useState<any>(useUserAssetBalance(internalAddresses.agUSDC));
    const [ balanceAgGNO, setBalanceAgGNO ] = useState<any>(useUserAssetBalance(internalAddresses.agGNO));
    const [ balanceAgUSDT, setBalanceAgUSDT ] = useState<any>(useUserAssetBalance(internalAddresses.agUSDT));
    const [ balanceAgWETH, setBalanceAgWETH ] = useState<any>(useUserAssetBalance(internalAddresses.agWETH));
    const [ balanceAgWBTC, setBalanceAgWBTC ] = useState<any>(useUserAssetBalance(internalAddresses.agWBTC));

    const [ balanceCagWXDAI, setBalanceCagWXDAI ] = useState<any>(useUserAssetBalance(internalAddresses.cagWXDAIProxy));
    const [ balanceCagUSDC, setBalanceCagUSDC ] = useState<any>(useUserAssetBalance(internalAddresses.cagUSDCProxy));
    const [ balanceCagGNO, setBalanceCagGNO ] = useState<any>(useUserAssetBalance(internalAddresses.cagGNOProxy));
    const [ balanceCagUSDT, setBalanceCagUSDT ] = useState<any>(useUserAssetBalance(internalAddresses.cagUSDTProxy));
    const [ balanceCagWETH, setBalanceCagWETH ] = useState<any>(useUserAssetBalance(internalAddresses.cagWETHProxy));
    const [ balanceCagWBTC, setBalanceCagWBTC ] = useState<any>(useUserAssetBalance(internalAddresses.cagWBTCProxy));

    const [ decimalsWXDAI, setdecimalsWXDAI ] = useState<any>(tokenDecimals(internalAddresses.WXDAI));
    const [ decimalsUSDC, setDecimalsUSDC ] = useState<any>(tokenDecimals(internalAddresses.USDC));
    const [ decimalsGNO, setDecimalsGNO ] = useState<any>(tokenDecimals(internalAddresses.GNO));
    const [ decimalsUSDT, setDecimalsUSDT ] = useState<any>(tokenDecimals(internalAddresses.USDT));
    const [ decimalsWETH, setDecimalsWETH ] = useState<any>(tokenDecimals(internalAddresses.WETH));
    const [ decimalsWBTC, setDecimalsWBTC ] = useState<any>(tokenDecimals(internalAddresses.WBTC));

    const [ decimalsAgWXDAI, setDecimalsAgWXDAI ] = useState<any>(tokenDecimals(internalAddresses.agWXDAI));
    const [ decimalsAgUSDC, setDecimalsAgUSDC ] = useState<any>(tokenDecimals(internalAddresses.agUSDC));
    const [ decimalsAgGNO, setDecimalsAgGNO ] = useState<any>(tokenDecimals(internalAddresses.agGNO));
    const [ decimalsAgUSDT, setDecimalsAgUSDT ] = useState<any>(tokenDecimals(internalAddresses.agUSDT));
    const [ decimalsAgWETH, setDecimalsAgWETH ] = useState<any>(tokenDecimals(internalAddresses.agWETH));
    const [ decimalsAgWBTC, setDecimalsAgWBTC ] = useState<any>(tokenDecimals(internalAddresses.agWBTC));

    const [ decimalsCagWXDAI, setDecimalsCagWXDAI ] = useState<any>(tokenDecimals(internalAddresses.cagWXDAIProxy));
    const [ decimalsCagUSDC, setDecimalsCagUSDC ] = useState<any>(tokenDecimals(internalAddresses.cagUSDCProxy));
    const [ decimalsCagGNO, setDecimalsCagGNO ] = useState<any>(tokenDecimals(internalAddresses.cagGNOProxy));
    const [ decimalsCagUSDT, setDecimalsCagUSDT ] = useState<any>(tokenDecimals(internalAddresses.cagUSDTProxy));
    const [ decimalsCagWETH, setDecimalsCagWETH ] = useState<any>(tokenDecimals(internalAddresses.cagWETHProxy));
    const [ decimalsCagWBTC, setDecimalsCagWBTC ] = useState<any>(tokenDecimals(internalAddresses.cagWBTCProxy));

    const [ balances, setBalances ] = useState<any>();
    const [ decimals, setDecimals ] = useState<any>();

    useEffect(()=>{
      setBalances({
        'WXDAI': balanceWXDAI,
        'USDC': balanceUSDC,
        'GNO': balanceGNO,
        'USDT': balanceUSDT,
        'WETH': balanceWETH,
        'WBTC': balanceWBTC,
        'agWXDAI': balanceAgWXDAI,
        'agUSDC': balanceAgUSDC,
        'agGNO': balanceAgGNO,
        'agUSDT': balanceAgUSDT,
        'agWETH': balanceAgWETH,
        'agWBTC': balanceAgWBTC,
        'cagWXDAI': balanceCagWXDAI,
        'cagUSDC': balanceCagUSDC,
        'cagGNO': balanceCagGNO,
        'cagUSDT': balanceCagUSDT,
        'cagWETH': balanceCagWETH,
        'cagWBTC': balanceCagWBTC,
      });
    },[balanceWXDAI, balanceUSDC, balanceGNO,  balanceUSDT, balanceWETH, balanceWBTC, balanceAgWXDAI, balanceAgUSDC, balanceAgGNO, balanceAgUSDT, balanceAgWETH, balanceAgWBTC, balanceCagWXDAI, balanceCagUSDC, balanceCagGNO, balanceCagUSDT, balanceCagWETH, balanceCagWBTC]);

    useEffect(()=>{
      setDecimals({
        'WXDAI': decimalsWXDAI,
        'USDC': decimalsUSDC,
        'GNO': decimalsGNO,
        'USDT': decimalsUSDT,
        'WETH': decimalsWETH,
        'WBTC': decimalsWBTC,
        'agWXDAI': decimalsAgWXDAI,
        'agUSDC': decimalsAgUSDC,
        'agGNO': decimalsAgGNO,
        'agUSDT': decimalsAgUSDT,
        'agWETH': decimalsAgWETH,
        'agWBTC': decimalsAgWBTC,
        'cagWXDAI': decimalsCagWXDAI,
        'cagUSDC': decimalsCagUSDC,
        'cagGNO': decimalsCagGNO,
        'cagUSDT': decimalsCagUSDT,
        'cagWETH': decimalsCagWETH,
        'cagWBTC': decimalsCagWBTC,
      });
    },[decimalsWXDAI, decimalsUSDC, decimalsGNO, decimalsUSDT, decimalsWETH, decimalsWBTC, decimalsAgWXDAI, decimalsAgUSDC, decimalsAgGNO, decimalsAgUSDT, decimalsAgWETH, decimalsAgWBTC, decimalsCagWXDAI, decimalsCagUSDC, decimalsCagGNO, decimalsCagUSDT, decimalsCagWETH, decimalsCagWBTC]);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ tokenToWrap, setTokenToWrap ] = useState('');
    const [ tokenToUnwrap, setTokenToUnwrap ] = useState('');
    const [ tokenToWrapTarget, setTokenToWrapTarget ] = useState('');
    const [ tokenToUnwrapTarget, setTokenToUnwrapTarget ] = useState('');
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

    const tokens = [
      // unwrapped, wrapped
      ['agWXDAI', 'cagWXDAI'],
      ['agUSDC', 'cagUSDC'],
      ['agGNO', 'cagGNO'],
      ['agUSDT', 'cagUSDT'],
      ['agWETH', 'cagWETH'],
      ['agWBTC', 'cagWBTC'],
    ]

    function getTokenPair(tkn:string) {
      let result = '';
      tokens.forEach((x) => { 
        if (tkn == x[0]) { result = x[1]; }
        else if (tkn == x[1]) { result = x[0]; } 
      });
      return result;
    }

    function updateTokens(action:string) { // wrap or unwrap
      const token = action=="wrap"?tokenToWrap:tokenToUnwrap;
      const targetToken = getTokenPair(token);

      if (token=='') {
        action=="wrap"?setToWrapButtonText("Select token"):setToUnwrapButtonText("Select token");
        action=="wrap"?setWrappedButtonText(""):setUnwrappedButtonText("");
        action=="wrap"?setMaxBalanceToWrap(BigNumber.from(0)):setMaxBalanceToUnwrap(BigNumber.from(0));
        action=="wrap"?setBalanceToWrap(BigNumber.from(0)):setBalanceToUnwrap(BigNumber.from(0));
        action=="wrap"?setTokenToWrapDecimals(0):setTokenToUnwrapDecimals(0);
    } else {
        action=="wrap"?setBalanceToWrap(BigNumber.from(0)):setBalanceToUnwrap(BigNumber.from(0))

        const btnText = (
          <HStack>
            <TokenIcon 
                symbol={token} 
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
                {token}
            </Text>
         </HStack>
        );

        const targetBtnText =  (
          <HStack>
            <TokenIcon 
                symbol={targetToken} 
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
                {targetToken}
            </Text>
          </HStack>
        );

        action=="wrap"?setToWrapButtonText(btnText):setToUnwrapButtonText(btnText);
        action=="wrap"?setWrappedButtonText(targetBtnText):setUnwrappedButtonText(targetBtnText);

        action=="wrap"?setMaxBalanceToWrap(balances[token].data):setMaxBalanceToUnwrap(balances[token].data);
        action=="wrap"?setTokenToWrapDecimals(decimals[token].data):setTokenToUnwrapDecimals(decimals[token].data);
      };
    }

    useEffect(() => {
      updateTokens("wrap");
      onClose();
    }, [tokenToWrap]);

    useEffect(() => {
      updateTokens("unwrap");
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
            setTokenTarget={outerType=="wrap"?setTokenToWrapTarget:setTokenToUnwrapTarget}
            balance={outerType=="wrap"?balanceToWrap:balanceToUnwrap}
            maxBalance={outerType=="wrap"?maxBalanceToWrap:maxBalanceToUnwrap}
            setBalance={outerType=="wrap"?setBalanceToWrap:setBalanceToUnwrap}
            buttonText={outerType=="wrap"?toWrapButtonText:toUnwrapButtonText}
            maxDecimalsToDisplay={maxDecimalsToDisplay}
            tokenDecimals={outerType=="wrap"?tokenToWrapDecimals:tokenToUnwrapDecimals}
            toTextColor={toTextColor}
            outerType={outerType}
            innerType="from"
            isModalTrigger={true}
            onClick={() =>{}}
            tokens={tokens}
            getTokenPair={getTokenPair}
          />
          <InnerBox
            token={outerType=="wrap"?'ag'+tokenToWrap:tokenToUnwrap.substring(2)}
            setToken={undefined}
            setTokenTarget={undefined}
            balance={outerType=="wrap"?balanceToWrap:balanceToUnwrap}
            maxBalance={BigNumber.from(0)}
            setBalance={outerType=="wrap"?setBalanceToWrap:setBalanceToUnwrap}
            buttonText={outerType=="wrap"?wrappedButtonText:unwrappedButtonText}
            maxDecimalsToDisplay={maxDecimalsToDisplay}
            tokenDecimals={outerType=="wrap"?tokenToWrapDecimals:tokenToUnwrapDecimals}
            toTextColor={toTextColor}
            outerType={outerType}
            innerType="to"
            isModalTrigger={false}
            onClick={() =>{}}
            tokens={tokens}
            getTokenPair={getTokenPair}
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
    setTokenTarget: any,
    buttonText: string | ReactNode | undefined;
    innerType: "from" | "to";
    outerType: "wrap" | "unwrap";
    maxDecimalsToDisplay: number;
    tokenDecimals: number;
    toTextColor: string;
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
    setTokenTarget,
    buttonText,
    innerType,
    outerType,
    maxDecimalsToDisplay,
    tokenDecimals,
    toTextColor,
    onClick,
    tokens,
    getTokenPair,
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
                    setTokenTarget={setTokenTarget}
                    getTokenPair={getTokenPair}
                    onClose={onClose}
                    tokens={tokens}
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
                        setTokenTarget('');
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
    setTokenTarget: any;
    getTokenPair:any;
    onClose:any;
    tokens:string[][];
} & CenterProps> = ({
    outerType,
    setToken,
    setTokenTarget,
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
                            setTokenTarget(getTokenPair(tkn));
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

