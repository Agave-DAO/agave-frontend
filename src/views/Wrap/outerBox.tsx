import React, { useEffect, useState, useMemo } from "react";
import { Center, Text, VStack, Button } from "@chakra-ui/react";
import { CenterProps, HStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import ColoredText from "../../components/ColoredText";
import { fontSizes } from "../../utils/constants";
import { BigNumber, BigNumberish } from "ethers";
import { TokenIcon } from "../../utils/icons";
import { InnerBox } from "./innerBox";
import { Wrapping } from "./wrapping";

export const OuterBox: React.FC<{
    outerType: "wrap" | "unwrap";
    tokenBalances: any,
    tokenDecimals: any,
    tokens: any
} & CenterProps> = ({
    outerType,
    children,
    tokenBalances,
    tokenDecimals,
    tokens,
    ...props
}) => {

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [ tokenToWrap, setTokenToWrap ] = useState('');
    const [ tokenToUnwrap, setTokenToUnwrap ] = useState('');
    const [ balanceToWrap, setBalanceToWrap ] = useState<BigNumber | undefined>(BigNumber.from(0));
    const [ balanceToUnwrap, setBalanceToUnwrap ] = useState<BigNumber | undefined>(BigNumber.from(0));

    const tokenToWrapTarget = React.useMemo(()=>{
      return getTokenPair(tokenToWrap)
    },[tokenToWrap]);
    
    const tokenToUnwrapTarget = React.useMemo(()=>{
      return getTokenPair(tokenToWrap)
    },[tokenToUnwrap]);

    const maxBalanceToWrap = React.useMemo(() => {
      return tokenToWrap==''? undefined : tokenBalances[tokenToWrap];
    },[tokenToWrap, tokenBalances, tokenDecimals]);

    const maxBalanceToUnwrap = React.useMemo(() => {
      return tokenToUnwrap==''? undefined : tokenBalances[tokenToUnwrap];
    },[tokenToUnwrap, tokenBalances, tokenDecimals]);

    const tokenToWrapDecimals = React.useMemo(() => {
      return tokenToWrap==''? 0 : tokenDecimals[tokenToWrap];
    }, [tokenDecimals, tokenToWrap]);

    const tokenToUnwrapDecimals = React.useMemo(() => {
      return tokenToUnwrap==''? 0 : tokenDecimals[tokenToUnwrap];
    }, [tokenDecimals, tokenToUnwrap]);

    const toWrapButtonText = React.useMemo(() => {
      const token = tokenToWrap;
      let btnText = (
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
      return (token==''?"Select token":btnText);
    },[tokenToWrap]);
    
    const toUnwrapButtonText = React.useMemo(() => {
      const token = tokenToUnwrap;
      let btnText = (
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
      return (token==''?"Select token":btnText);
    },[tokenToUnwrap]);

    const wrappedButtonText = React.useMemo(() => {
      const targetToken = tokenToWrapTarget;
      const btnText =  (
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
              color="white"
          >
              {targetToken}
          </Text>
        </HStack>
      );
      return (targetToken==''?"":btnText);
    },[tokenToWrapTarget]);

    const unwrappedButtonText = React.useMemo(() => {
      const targetToken = tokenToUnwrapTarget;
      const btnText =  (
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
              color="white"
          >
              {targetToken}
          </Text>
        </HStack>
      );
      return (targetToken==''?"":btnText);
    },[tokenToUnwrapTarget]);

    function getTokenPair(tkn:string) {
      let result = '';
      tokens.forEach((x:any) => { 
        if (tkn == x[0]) { result = x[1]; }
        else if (tkn == x[1]) { result = x[0]; } 
      });
      return result;
    }

    useEffect(() => {
      onClose();
    }, [tokenToWrap, tokenToUnwrap]);

    const [isWrapButtonDisabled, setIsWrapButtonDisabled] = React.useState(true);
    const [isUnwrapButtonDisabled, setIsUnwrapButtonDisabled] = React.useState(true);
    
    React.useEffect(() => {
      setIsWrapButtonDisabled(
        (outerType=="wrap" && balanceToWrap === undefined) ||
        (outerType=="wrap" && balanceToWrap !== undefined && balanceToWrap<=BigNumber.from(0)) ||
        (outerType=="wrap" && balanceToWrap !== undefined && balanceToWrap > maxBalanceToWrap)     
      )
    }, [balanceToWrap]);    

    React.useEffect(() => {
      setIsUnwrapButtonDisabled(
        (outerType=="unwrap" && balanceToUnwrap === undefined) ||
        (outerType=="unwrap" && balanceToUnwrap !== undefined && balanceToUnwrap<=BigNumber.from(0)) ||
        (outerType=="unwrap" && balanceToUnwrap !== undefined && balanceToUnwrap > maxBalanceToUnwrap)   
      )
    }, [balanceToUnwrap]);

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
            decimals={outerType=="wrap"?tokenToWrapDecimals:tokenToUnwrapDecimals}
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
            balance={outerType=="wrap"?balanceToWrap:balanceToUnwrap}
            maxBalance={BigNumber.from(0)}
            setBalance={outerType=="wrap"?setBalanceToWrap:setBalanceToUnwrap}
            buttonText={outerType=="wrap"?wrappedButtonText:unwrappedButtonText}
            decimals={outerType=="wrap"?tokenToWrapDecimals:tokenToUnwrapDecimals}
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
            disabled={
              (outerType=="wrap" && isWrapButtonDisabled) ||
              (outerType=="unwrap" && isUnwrapButtonDisabled)
            }
           >
            {outerType=="wrap"?"Wrap":"Unwrap"}
          </Button>
        </VStack>

        {(outerType=="wrap" && !isWrapButtonDisabled) || (outerType=="unwrap" && !isUnwrapButtonDisabled)?(
          <Wrapping 
            type={outerType}
            token={outerType=="wrap"?tokenToWrap:tokenToUnwrap}
            amount={outerType=="wrap"?balanceToWrap:balanceToUnwrap}
          />
        ):("")}
      </Center>
    );

};

