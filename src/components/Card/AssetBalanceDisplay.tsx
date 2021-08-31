import React from "react";
import { Text, Box, Tooltip, Flex } from "@chakra-ui/react";
import { bigNumberToString } from "../../utils/fixedPoint";
import { TokenIcon } from "../../utils/icons";
import { DepositAsset } from "../../views/Deposit";
import { BorrowAsset } from "../../views/Borrow";

export const AssetBalanceDisplay: React.FC<{
  asset: DepositAsset | BorrowAsset;
}> = ({ asset }) => {
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
            <TokenIcon symbol={asset?.symbol} />
            <Text ml={4} alignSelf="center">
              {asset?.symbol}
            </Text>
          </Box>
          <Box p={1} textAlign="end">
            <Tooltip
              fontSize="big"
              label={
                bigNumberToString(
                  asset?.balance,
                  asset?.decimals,
                  asset?.decimals
                ) +
                " " +
                asset?.symbol
              }
              aria-label="balance in Wei"
              bg="secondary.900"
              placement="top-start"
            >
              <Text fontSize="smaller">
                {bigNumberToString(asset?.balance, 4)} x $
                {bigNumberToString(asset?.daiWeiPricePer, 2)}
              </Text>
            </Tooltip>
            <Text fontWeight="bold">
              $ {bigNumberToString(asset?.daiWeiPriceTotal, 2)}
            </Text>
          </Box>
        </Box>
      </Flex>
    );
  }, [asset]);
};
