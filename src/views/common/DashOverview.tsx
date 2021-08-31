import { Box, Text, VStack } from "@chakra-ui/layout";
import React from "react";
import ColoredText from "../../components/ColoredText";
import InfoWeiBox from "./InfoWeiBox";
import { BigNumber } from "ethers";
import { Button } from "@chakra-ui/button";

import { fontSizes, LINEAR_GRADIENT_BG } from "../../utils/constants";
import {
  NATIVE_TOKEN,
  ReserveOrNativeTokenDefinition,
} from "../../queries/allReserveTokens";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";
import {
  useMaxChangeGivenHealthFactor,
  useNewHealthFactorCalculator,
} from "../../utils/propertyCalculator";
import { useWrappedNativeDefinition } from "../../queries/wrappedNativeAddress";
import {
  MIN_SAFE_HEALTH_FACTOR,
  MINIMUM_NATIVE_RESERVE,
} from "../../utils/constants";

/** INTRO SECTION */
export const DashOverviewIntro: React.FC<{
  mode: "repay" | "deposit" | "withdraw" | "borrow";
  onSubmit: (value: BigNumber) => void;
  asset: ReserveOrNativeTokenDefinition;
  amount: BigNumber | undefined;
  setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
  balance: BigNumber | undefined;
}> = ({ asset, mode, onSubmit, amount, setAmount, balance }) => {
  const { data: decimals } = useDecimalCountForToken(asset.tokenAddress);
  const { data: wNative } = useWrappedNativeDefinition();
  const tokenAddress =
    asset.tokenAddress === NATIVE_TOKEN
      ? wNative?.tokenAddress
      : asset.tokenAddress;

  const newHealthFactor = useNewHealthFactorCalculator(
    amount,
    tokenAddress,
    mode === "withdraw" || mode === "deposit",
    mode === "deposit" || mode === "borrow"
  );

  const maxAmount = useMaxChangeGivenHealthFactor(
    balance,
    tokenAddress,
    mode,
    MIN_SAFE_HEALTH_FACTOR
  );

  const limitAmount = balance && maxAmount?.lt(balance) ? maxAmount : balance;

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
        healthFactor={newHealthFactor}
        mode={mode}
        balance={
          // If NATIVE don't allow to deposit the full balance in a wallet! Leave 0.1
          asset.tokenAddress === NATIVE_TOKEN &&
          (mode === "deposit" || mode === "repay")
            ? limitAmount?.sub(MINIMUM_NATIVE_RESERVE)
            : limitAmount
        }
        decimals={decimals ? decimals : 18}
      />
      <Box h="4.3rem" />
      <Button
        disabled={
          !amount?.gt(0) ||
          (balance && amount?.gt(balance)) ||
          (limitAmount && amount?.gt(limitAmount))
        }
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
        {balance && amount?.gt(balance)
          ? "Not enough Balance"
          : limitAmount && amount?.gt(limitAmount)
          ? "Insufficient collateral to cover risk"
          : "Continue"}
      </Button>
    </VStack>
  );
};
