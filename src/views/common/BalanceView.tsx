import React from "react";
import { Box, Text } from "@chakra-ui/layout";
import { bigNumberToString } from "../../utils/fixedPoint";
import { BigNumber } from "ethers";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";
import { ReserveOrNativeTokenDefinition } from "../../queries/allReserveTokens";

export const BalanceView: React.FC<{
  balanceBN: BigNumber;
  asset: ReserveOrNativeTokenDefinition;
}> = ({ balanceBN, asset }) => {
  const decimals = useDecimalCountForToken(asset).data;
  const balance = bigNumberToString(balanceBN, 4, decimals);
  return React.useMemo(() => {
    return (
      <Box minWidth="6rem">
        <Text p={3}>{balance}</Text>
      </Box>
    );
  }, [balance]);
};
