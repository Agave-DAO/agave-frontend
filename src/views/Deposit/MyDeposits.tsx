import React from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Divider, Flex, VStack } from "@chakra-ui/react";
import { DepositAsset } from ".";
import { bigNumberToString } from "../../utils/fixedPoint";
import { AssetBalanceDisplay } from "../../components/Card/AssetBalanceDisplay";
import { constants } from "ethers";

const Deposits: React.FC<{ assets: DepositAsset[] }> = ({ assets }) => {
  const total = React.useMemo(() => {
    return assets.reduce(
      (memo, next) =>
        next.daiWeiPriceTotal !== null ? memo.add(next.daiWeiPriceTotal) : memo,
      constants.Zero
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
          py="2rem"
          divider={depositDivider}
          children={assets.map((value, i) => (
            <AssetBalanceDisplay key={value.tokenAddress} asset={value} />
          ))}
        />
        {}
        <Divider></Divider>
        <Flex
          alignSelf="center"
          justifyContent="space-between"
          w="100%"
          px={{ base: "2.4rem", md: "2.4rem" }}
          pt={6}
        >
          <Text>Total</Text>
          <Text fontWeight="bold">$ {bigNumberToString(total, 2)}</Text>
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
        w="auto"
        minW={{ md: 300 }}
        ml={{ base: 0, md: 10 }}
        marginTop={0}
        boxSizing="content-box"
        rounded="xl"
        bg="primary.900"
        py="2rem"
        color="white"
      >
        <VStack w="100%" align="stretch" flexDirection="column">
          <Box ml="2.4rem" color="white" mb={5}>
            <Text>My Deposits</Text>
          </Box>
          <Box h="0.2rem" backgroundColor="primary.50" />
          <Deposits assets={deposits} />
        </VStack>
      </Box>
    </div>
  );
};
