import { Box, Text, VStack } from "@chakra-ui/layout";
import React from "react";
import ColoredText from "../../components/ColoredText";
import InfoWeiBox from "./InfoWeiBox";
import { BigNumber } from "ethers";
import { Button } from "@chakra-ui/button";

import { fontSizes, LINEAR_GRADIENT_BG } from "../../utils/constants";
import { ReserveOrNativeTokenDefinition } from "../../queries/allReserveTokens";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";

/** INTRO SECTION */
export const DashOverviewIntro: React.FC<{
  mode: string;
  onSubmit: (value: BigNumber) => void;
  asset: ReserveOrNativeTokenDefinition;
  amount: BigNumber | undefined;
  setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
  balance: BigNumber | undefined;
}> = ({ asset, mode, onSubmit, amount, setAmount, balance }) => {
  const { data: decimals } = useDecimalCountForToken(asset.tokenAddress);
  return (
    <VStack w={{ base: "90%", sm: "75%", md: "60%", lg: "50%" }} spacing="0">
      <ColoredText fontSize="1.8rem" textTransform="capitalize" pb="1rem">
        {mode}
      </ColoredText>
      <Text fontSize={fontSizes.md}>How much do you want to {mode}?</Text>
      <Box h="3.3rem" />
      <InfoWeiBox
        w="100%"
        currency={asset.symbol}
        amount={amount}
        setAmount={setAmount}
        mode={mode}
        balance={balance}
        decimals={decimals ? decimals : 18}
      />
      <Box h="4.3rem" />
      <Button
        disabled={!amount?.gt(0) || (balance && amount?.gt(balance))}
        bg={LINEAR_GRADIENT_BG}
        _hover={{
          background: LINEAR_GRADIENT_BG,
        }}
        color="secondary.900"
        fontSize={fontSizes.md}
        px="7.5rem"
        py=".8rem"
        onClick={() => onSubmit(amount || BigNumber.from(0))}
      >
        {balance && amount?.gt(balance) ? "Not enough Balance" : "Continue"}
      </Button>
    </VStack>
  );
};
