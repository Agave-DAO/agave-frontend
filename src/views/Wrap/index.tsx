import React, { useEffect } from "react";
import { Box, Center, Text, Flex } from "@chakra-ui/react";
import { isMobileOnly} from "react-device-detect";
import { OuterBox } from "./outerBox";
import { BigNumber, BigNumberish } from "ethers";
import { useUserDepositAssetBalancesDaiWei } from "../../queries/userAssets";
import { useUserCagTokensBalance } from "../../queries/cagTokenBalances";
import { useUserAssetBalance } from "../../queries/userAssets";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";

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

export const Wrap: React.FC<IWrap> = () => {

  const getAgBalances = useUserDepositAssetBalancesDaiWei();
  const depositedList: DepositAsset[] = React.useMemo(() => getAgBalances?.data?.filter(asset => (BigNumber.isBigNumber(asset.balance))) ?? [],[getAgBalances]);

  const { data: getBalanceOfAgWXDAI } = useUserAssetBalance(internalAddressesPerNetwork.Gnosis.agWXDAI);
  const { data: getBalanceOfAgUSDC } = useUserAssetBalance(internalAddressesPerNetwork.Gnosis.agUSDC);
  const { data: getBalanceOfAgUSDT } = useUserAssetBalance(internalAddressesPerNetwork.Gnosis.agUSDT);
  const { data: getBalanceOfAgGNO } = useUserAssetBalance(internalAddressesPerNetwork.Gnosis.agGNO);
  const { data: getBalanceOfAgWETH } = useUserAssetBalance(internalAddressesPerNetwork.Gnosis.agWETH);
  const { data: getBalanceOfAgWBTC } = useUserAssetBalance(internalAddressesPerNetwork.Gnosis.agWBTC);
  
  const { data: getBalanceOfCagWXDAI } = useUserCagTokensBalance(internalAddressesPerNetwork.Gnosis.cagWXDAI);
  const { data: getBalanceOfCagUSDC } = useUserCagTokensBalance(internalAddressesPerNetwork.Gnosis.cagUSDC);
  const { data: getBalanceOfCagUSDT } = useUserCagTokensBalance(internalAddressesPerNetwork.Gnosis.cagUSDT);
  const { data: getBalanceOfCagGNO } = useUserCagTokensBalance(internalAddressesPerNetwork.Gnosis.cagGNO);
  const { data: getBalanceOfCagWETH } = useUserCagTokensBalance(internalAddressesPerNetwork.Gnosis.cagWETH);
  const { data: getBalanceOfCagWBTC } = useUserCagTokensBalance(internalAddressesPerNetwork.Gnosis.cagWBTC);
  
  const balanceOfAgWXDAI = React.useMemo(() => { return getBalanceOfAgWXDAI; }, [getBalanceOfAgWXDAI]);
  const balanceOfAgUSDC = React.useMemo(() => { return getBalanceOfAgUSDC; }, [getBalanceOfAgUSDC]);
  const balanceOfAgUSDT = React.useMemo(() => { return getBalanceOfAgUSDT; }, [getBalanceOfAgUSDT]);
  const balanceOfAgGNO = React.useMemo(() => { return getBalanceOfAgGNO; }, [getBalanceOfAgGNO]);
  const balanceOfAgWETH = React.useMemo(() => { return getBalanceOfAgWETH; }, [getBalanceOfAgWETH]);
  const balanceOfAgWBTC = React.useMemo(() => { return getBalanceOfAgWBTC; }, [getBalanceOfAgWBTC]);
  
  const balanceOfCagWXDAI = React.useMemo(() => { return getBalanceOfCagWXDAI; }, [getBalanceOfCagWXDAI]);
  const balanceOfCagUSDC = React.useMemo(() => { return getBalanceOfCagUSDC; }, [getBalanceOfCagUSDC]);
  const balanceOfCagUSDT = React.useMemo(() => { return getBalanceOfCagUSDT; }, [getBalanceOfCagUSDT]);
  const balanceOfCagGNO = React.useMemo(() => { return getBalanceOfCagGNO; }, [getBalanceOfCagGNO]);
  const balanceOfCagWETH = React.useMemo(() => { return getBalanceOfCagWETH; }, [getBalanceOfCagWETH]);
  const balanceOfCagWBTC = React.useMemo(() => { return getBalanceOfCagWBTC; }, [getBalanceOfCagWBTC]);
  
  const tokenBalances = React.useMemo(() => {
    return ({

        'agWXDAI': balanceOfAgWXDAI,
        'agUSDC': balanceOfAgUSDC,
        'agUSDT': balanceOfAgUSDT,
        'agGNO': balanceOfAgGNO,
        'agWETH': balanceOfAgWETH,
        'agWBTC': balanceOfAgWBTC,

        'cagWXDAI': balanceOfCagWXDAI,
        'cagUSDC': balanceOfCagUSDC,
        'cagUSDT': balanceOfCagUSDT,
        'cagGNO': balanceOfCagGNO,
        'cagWETH': balanceOfCagWETH,
        'cagWBTC': balanceOfCagWBTC,
        
    });    
  }, [balanceOfAgWXDAI, balanceOfAgUSDC, balanceOfAgUSDT, balanceOfAgGNO, balanceOfAgGNO, balanceOfAgWETH, balanceOfAgWBTC, balanceOfCagWXDAI, balanceOfCagUSDC, balanceOfCagUSDT, balanceOfCagGNO, balanceOfCagWETH, balanceOfCagWBTC]);

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

};

