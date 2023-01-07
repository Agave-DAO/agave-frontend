import React from "react";
import { Box, Center, Text, Flex } from "@chakra-ui/react";
import { isMobileOnly} from "react-device-detect";
import { OuterBox } from "./outerBox";
import { BigNumber, BigNumberish } from "ethers";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { useNativeSymbols } from "../../utils/icons";

export interface IWrap {}

export interface DepositAsset {
  symbol: string;
  aSymbol: string;
  tokenAddress: string;
  aTokenAddress: string;
  balance: BigNumber;
  decimals: BigNumberish;
  daiWeiPricePer: BigNumber | null;
  daiWeiPriceTotal: BigNumber | null;
}

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

export const WrapLayout: React.FC<{
  tokenBalances: any; 
  tokenDecimals: any;
  tokens: any;
}> = ({
  tokenBalances,
  tokenDecimals,
  tokens
}) => {

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
            tokenBalances={tokenBalances}
            tokenDecimals={tokenDecimals}
            tokens={tokens}
            mr={{ base: "inherit", lg: "1%" }}
          >
          </OuterBox>

          <OuterBox
            outerType="unwrap"
            tokenBalances={tokenBalances}
            tokenDecimals={tokenDecimals}
            tokens={tokens}
            ml={{ base: "inherit", lg: "1%" }}
          >
          </OuterBox>

        </Flex>
      </Flex>
    );
}

export const Wrap: React.FC<IWrap> = () => {

  const getBalances = useUserDepositAssetBalancesDaiWei();
  const depositedList: DepositAsset[] = React.useMemo(() => getBalances?.data?.filter(asset => (BigNumber.isBigNumber(asset.balance))) ?? [],[getBalances]);
  
   const tokenBalances = React.useMemo(() => {
    let newBalances:any = {
      'agWXDAI': undefined,
      'agUSDC': undefined,
      'agUSDT': undefined,
      'agGNO': undefined,
      'agWETH': undefined,
      'agWBTC': undefined,
      'cagWXDAI': undefined,
      'cagUSDC': undefined,
      'cagUSDT': undefined,
      'cagGNO': undefined,
      'cagWETH': undefined,
      'cagWBTC': undefined
    }
    depositedList.forEach(function (x) {
      newBalances[x.aSymbol] = x.balance;
    });
    console.log(newBalances);
    return newBalances;
  },[getBalances]);

  const tokenDecimals = {
    'agWXDAI': 18,
    'agUSDC': 6,
    'agUSDT': 6,
    'agGNO': 18,
    'agWETH': 18,
    'agWBTC': 8,
    'cagWXDAI': 18,
    'cagUSDC': 6,
    'cagUSDT': 6,
    'cagGNO': 18,
    'cagWETH': 18,
    'cagWBTC': 8
  };

  const tokens = [
    // unwrapped, wrapped
    ['agWXDAI', 'cagWXDAI'],
    ['agUSDC', 'cagUSDC'],
    ['agGNO', 'cagGNO'],
    ['agUSDT', 'cagUSDT'],
    ['agWETH', 'cagWETH'],
    ['agWBTC', 'cagWBTC'],
  ]

  return  (
      <WrapLayout 
        tokenBalances={tokenBalances}
        tokenDecimals={tokenDecimals}
        tokens={tokens}
      />
  );

};

