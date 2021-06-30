import React from "react";
import { ethers } from "ethers";
import { Box, Text } from "@chakra-ui/layout";
import { Flex, VStack } from "@chakra-ui/react";
import { DepositAsset } from ".";
import { TokenIcon } from "../../utils/icons";

const AssetBalanceDisplay: React.FC<{ asset: DepositAsset }> = ({ asset }) => {
  return React.useMemo(() => {
    return (
      <Flex direction="row" minH={30} h="100%" w="100%">
        <Box
          w="100%"
          d="flex"
          flexDir="row"
          p={3}
          px="2rem"
          color="white"
          alignSelf="center"
          justifyContent="space-between"
        >
          <Box textAlign="center" alignSelf="center" d="flex">
            <TokenIcon symbol={asset.symbol} />
            <Text ml={4} alignSelf="center">
              {asset.symbol}
            </Text>
          </Box>
          <Box>
            <Text p={3} fontWeight="bold">
              ${" "}
              {Number(ethers.utils.formatEther(asset.daiWeiPriceTotal ?? 0)) ??
                "-"}
            </Text>
          </Box>
        </Box>
      </Flex>
    );
  }, [asset]);
};

const Deposits: React.FC<{ assets: DepositAsset[] }> = ({ assets }) => {
  const total = React.useMemo(() => {
    return assets.reduce(
      (memo, next) =>
        memo +
        (Number(ethers.utils.formatEther(next.daiWeiPriceTotal ?? 0)) ?? 0),
      0
    );
  }, [assets]);
  const depositDivider = React.useMemo(
    () => <Box h="0.1rem" backgroundColor="primary.50" />,
    []
  );

  return React.useMemo(() => {
    return (
      <Flex w="100%" flexDir="column">
        <VStack
          divider={depositDivider}
          children={assets.map((value, i) => (
            <AssetBalanceDisplay key={value.tokenAddress} asset={value} />
          ))}
        />
        {}
        <Flex
          alignSelf="center"
          justifyContent="space-between"
          w="100%"
          px={{ base: "2.4rem", md: "2.4rem" }}
          pt={6}
        >
          <Text>Total</Text>
          <Text fontWeight="bold">$ {total}</Text>
        </Flex>
      </Flex>
    );
  }, [depositDivider, assets, total]);
};

export const MyDepositsTable: React.FC<{ deposits: DepositAsset[] }> = ({
  deposits,
}) => {
  return (
    <div>
      <Box
        minW={{ md: 250 }}
        ml={10}
        marginTop={0}
        boxSizing="content-box"
        rounded="xl"
        bg="primary.900"
        py="2rem"
        color="white"
      >
        <VStack w="100%" align="stretch" flexDirection="column">
          <Box ml="2.4rem" color="white" mb={2}>
            <Text>My Deposits</Text>
          </Box>
          <Box h="0.2rem" backgroundColor="primary.50" />
          <Deposits assets={deposits} />
        </VStack>
      </Box>
    </div>
  );
};
