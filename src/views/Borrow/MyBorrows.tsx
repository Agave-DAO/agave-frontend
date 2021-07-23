import React from "react";
import { Box, Text } from "@chakra-ui/layout";
import { Divider, Flex, VStack } from "@chakra-ui/react";
import { BorrowAsset } from ".";
import { TokenIcon } from "../../utils/icons";
import { bigNumberToString } from "../../utils/fixedPoint";

const AssetBalanceDisplay: React.FC<{ asset: BorrowAsset }> = ({ asset }) => {
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
              $ {bigNumberToString(asset.daiWeiPriceTotal)}
            </Text>
          </Box>
        </Box>
      </Flex>
    );
  }, [asset]);
};

const Borrows: React.FC<{ assets: BorrowAsset[] }> = ({ assets }) => {
  const total = React.useMemo(() => {
    return assets.reduce(
      (memo, next) => memo + Number(bigNumberToString(next.daiWeiPriceTotal)),
      0
    );
  }, [assets]);
  const borrowDivider = React.useMemo(
    () => <Box h="0.1rem" backgroundColor="primary.50" />,
    []
  );

  return React.useMemo(() => {
    return (
      <Flex w="100%" flexDir="column">
        <VStack
          py="2rem"
          divider={borrowDivider}
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
          <Text fontWeight="bold">$ {total.toFixed(2)}</Text>
        </Flex>
      </Flex>
    );
  }, [borrowDivider, assets, total]);
};

export const MyBorrowsTable: React.FC<{ borrows: BorrowAsset[] }> = ({
  borrows,
}) => {
  return (
    <div>
      <Box
        w="auto"
        minW={{ md: 250 }}
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
            <Text>My Borrows</Text>
          </Box>
          <Box h="0.2rem" backgroundColor="primary.50" />
          <Borrows assets={borrows} />
        </VStack>
      </Box>
    </div>
  );
};
