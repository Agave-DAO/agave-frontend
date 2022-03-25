import React, { useState } from "react";
import {
  Box,
  Center,
  StackDivider,
  Text,
  VStack,
  Spinner,
  Select,
  Tabs, 
  TabList,  
  Tab, 
} from "@chakra-ui/react";
import { CenterProps } from "@chakra-ui/layout";
import { TabContent } from "./tabContent"
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { useNativeSymbols } from "../../utils/icons";

interface AssetRecord {
  symbol: string;
  tokenAddress: string;
  aTokenAddress: string;
}

const LowerBox: React.FC<{ title: string } & CenterProps> = ({
    title,
    children,
    ...props
  }) => {
    return (
      <Center
        boxSizing="content-box"
        flexDirection="column"
        rounded="xl"
        minH="10.6rem"
        minW={{ base: "100%", lg: "auto" }}
        bg="primary.900"
        py="1rem"
        {...props}
      >
        <VStack
          divider={
            <StackDivider
              borderColor="#36CFA2"
              h="0.188rem"
              backgroundColor="#36CFA2"
            />
          }
          spacing={4}
          w="100%"
          align="stretch"
          flexDirection="column"
        >
          <Text px={{ base: "2rem", md: "3rem" }} h="25">
            {title}
          </Text>
          <Box px={{ base: "2rem", md: "3rem" }}>{children}</Box>
        </VStack>
      </Center>
    );
};

export const InfoBlock: React.FC<{
    type: string;
    props?: CenterProps;

}> = ({ type, ...props }) => {
  const [selectedTab, setTab] = useState(type === "Deposit" ? "Deposit" : "Withdraw");
  const [selectedCoin, setCoin] = useState("USDC"); // defaults to USDC since it's the first coin on the list
  const handleCoinChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCoin(event.target.value)
  }

  const reserves = useAllReserveTokensWithData();
  const nativeSymbols = useNativeSymbols();
  const assetRecords = React.useMemo(() => {
  const assets =
    reserves.data?.map(
      ({ symbol, tokenAddress, aTokenAddress }): AssetRecord => ({
        symbol,
        tokenAddress,
        aTokenAddress,
      })
    ) ?? [];
  return assets.map(asset => {
    return asset.symbol === nativeSymbols.wrappednative
      ? {
          ...asset,
          symbol: nativeSymbols?.native,
        }
      : asset;
    });
  }, [reserves]);

  const coinOptions = React.useMemo(
    () =>
      assetRecords.map( currency => {
        return (
            <option value={currency.symbol}>{currency.symbol}</option>
        )
      })
    , [assetRecords]
  );
  return (
    <LowerBox
      title={type}
      mr={type === "Deposit" ? "1%" : "0"}
      ml={type === "Deposit" ? "0" : "1%"}
      color='white'
      mb='1em'
      minW={{ base: "100%", lg: "49%" }}
    >
      {(!coinOptions.length) 
        ? (
          <Center>
            <Spinner 
              speed="0.5s" 
              emptyColor="gray.200" 
              color="yellow.500" 
              size='xl' />
          </Center>
          )
        : (
          <>
          <Select 
            borderColor='#00A490'
            bg='#00A490'
            size='lg'
            color='white'
            mb='2em'
            mt='1em'
            onChange={handleCoinChange}
          >
            {coinOptions}
          </Select>
          <Tabs 
            isFitted 
            variant='enclosed'
            onChange={(index) => {
              if (type === "Deposit") {
                setTab(index ? "Withdraw" : "Deposit")
              } else {
                setTab(index ? "Repay" : "Borrow")
              }
            }}
          >
            <TabList>
              <Tab
                fontSize='17'
                _selected={{ color: '#044D44', background: "linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);" }}
              > {type === "Deposit" ? "Deposit" : "Borrow"} </Tab>
              <Tab 
                fontSize='17'
                _selected={{ color: '#044D44', background: "linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);" }}
              > {type === "Deposit" ? "Withdraw" : "Repay"} </Tab>
            </TabList>
          <TabContent
            type={type}
            tab={selectedTab}
            coin={selectedCoin}
          />
        </Tabs>
        </>
        )
      }
    </LowerBox>
  )
}
