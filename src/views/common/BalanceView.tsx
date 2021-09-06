import React from "react";
import { Box, Text } from "@chakra-ui/layout";
import { bigNumberToString } from "../../utils/fixedPoint";
import { BigNumber } from "ethers";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";

export const BalanceView: React.FC<{
  balanceBN: BigNumber;
  tokenAddress: string;
}> = ({ balanceBN, tokenAddress }) => {
  const decimals = useDecimalCountForToken(tokenAddress).data;
  const balance = bigNumberToString(balanceBN, 4, decimals);
  return React.useMemo(() => {
    return (
      <Box minWidth="6rem">
        <Text p={3}>{balance}</Text>
      </Box>
    );
  }, [balance]);
};
