import React from "react";
import { ethers } from "ethers";
import { Box, Text } from "@chakra-ui/layout";

export const BalanceView: React.FC<{ balanceBN: string }> = ({
  balanceBN,
}) => {
  const balance = ethers.utils.formatEther(balanceBN ?? 0)
  return React.useMemo(() => {
    return (
      <Box minWidth="8rem" textAlign="left">
        <Text p={3}>{balance ?? "-"}</Text>
      </Box>
    );
  }, [balance]);
};
