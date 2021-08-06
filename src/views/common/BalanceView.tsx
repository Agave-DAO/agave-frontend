import React from "react";
import { ethers } from "ethers";
import { Box, Text } from "@chakra-ui/layout";
import { bigNumberToString } from "../../utils/fixedPoint";
import { BigNumber, BigNumberish, constants } from "ethers";

export const BalanceView: React.FC<{ balanceBN: BigNumber }> = ({
  balanceBN,
}) => {
  const balance = bigNumberToString(balanceBN, 3);
  return React.useMemo(() => {
    return (
      <Box minWidth="8rem" textAlign="left">
        <Text p={3}>{balance}</Text>
      </Box>
    );
  }, [balance]);
};
