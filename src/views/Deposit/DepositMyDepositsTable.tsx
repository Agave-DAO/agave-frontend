import React, { useState } from "react";
import { ethers } from "ethers";
import { useAssetPriceInDai } from "../../queries/assetPriceInDai";
import { useTokenBalance } from "../../hooks/balance"
import { Box, Text } from "@chakra-ui/layout";
import { Flex, StackDivider, VStack } from "@chakra-ui/react";
import { BigNumber } from "ethers";
import { DepositAsset } from ".";
import { TokenIcon } from "../../utils/icons";

const MyDepositsTable: React.FC<{ deposits: DepositAsset[] }> = ({ deposits }) => {
  const BalanceView: React.FC<{ asset: DepositAsset }> = ({  
    asset,
  }) => {
    const [ balance, setBalance ] = useState('')
    const [ balanceUSD, setBalanceUSD ] = useState('')

    const price = useAssetPriceInDai(asset.tokenAddress);
    useTokenBalance(asset.tokenAddress)?.then((value: BigNumber) => {
      const result = Number(ethers.utils.formatEther(value) || 0).toFixed(2)
      setBalance(result)
      setBalanceUSD((Number(result) * Number(price.data ?? 0)).toFixed(4))
    });
    
    console.log(asset)
    return React.useMemo(() => {
      return (
        <Flex direction="row" minH={30} h="100%" w="100%">
          <Box w="100%" d="flex" flexDir="row" p={3} pl={8}>
            <TokenIcon symbol={asset.symbol} />
            <Text p={3}>
              $ {balance ?? "-"}
            </Text>
          </Box>
        </Flex>
      );
    }, [balanceUSD, balance]);
  };

return (
    <div>
      <Box
          minW={{md: 250}}
          ml={10}
          marginTop={0}
          boxSizing="content-box"
          rounded="xl"
          bg="primary.900"
          py="2rem"
      >
        <VStack
          w='100%'
          align="stretch"
          flexDirection="column"
        >
          <Box 
            ml={27}
            color="white"
          >
            <Text>
              My Deposits
            </Text>
          </Box>
          <Box h="0.2rem" backgroundColor="primary.50" marginTop="1rem"/>
          
            { deposits.map((value: DepositAsset) => {
              return(
                <Box>
                  <BalanceView asset={value} />
                  <Box h="0.1rem" backgroundColor="primary.50" />
                </Box>
              )
            })}
          
          <Text pl={28} pt={5}>
            Total
          </Text>
        </VStack>
      </Box> 
    </div>
  );
}

export default MyDepositsTable;
