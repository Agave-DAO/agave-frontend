import React, { useEffect, useState, useMemo, useRef, ReactNode } from "react";
import { Center, Text, VStack, Button } from "@chakra-ui/react";
import { CenterProps, HStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import ColoredText from "../../components/ColoredText";
import { fontSizes } from "../../utils/constants";
import { useUserAssetBalance } from "../../queries/userAssets";
import { tokenDecimals } from "../../queries/tokenDecimals";
import { BigNumber } from "ethers";
import { TokenIcon } from "../../utils/icons";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";
import { InnerBox } from "./innerBox";

export const OuterBox: React.FC<{
    outerType: "wrap" | "unwrap";
} & CenterProps> = ({
    outerType,
    children,
    ...props
}) => {

    const internalAddresses = internalAddressesPerNetwork.Gnosis;

    const [ balanceWXDAI, setBalanceWXDAI ] = useState<any>(useUserAssetBalance(internalAddresses.WXDAI));
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

    const [ decimalsWXDAI, setDecimalsWXDAI ] = useState<any>(tokenDecimals(internalAddresses.WXDAI));
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