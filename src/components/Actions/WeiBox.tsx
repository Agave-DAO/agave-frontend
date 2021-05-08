import { BigNumberish, parseFixed } from "@ethersproject/bignumber";
import { BigNumber, FixedNumber } from "ethers";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Center,
  HStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon, RepeatIcon } from "@chakra-ui/icons";

// Equate (BigNumber | undefined) instances with eachother
function eqBigNumberOptions(
  a: BigNumber | undefined,
  b: BigNumber | undefined
): boolean {
  return !(a !== b && (a === undefined || b === undefined || !a.eq(b)));
}

function clampBigNumber(
  value: BigNumberish,
  minAmount: BigNumber | undefined,
  maxAmount: BigNumber | undefined
): BigNumber {
  if (value == null) {
    return value;
  }
  if (maxAmount && maxAmount.lt(value)) {
    return maxAmount;
  }
  if (minAmount && minAmount.gt(value)) {
    return minAmount;
  }
  return BigNumber.from(value);
}

export interface RawInputProps {
  value: string;
  setValue: (newRawAmount: string) => void;
  error?: boolean | undefined;
  helperText?: string | undefined;
}

export interface WeiInputProps {
  amount: BigNumber | undefined;
  setAmount: (newValue: BigNumber | undefined) => void;
  minAmount?: BigNumber | undefined;
  maxAmount?: BigNumber | undefined;
  children: (
    rawInputProps: RawInputProps
  ) => React.ReactElement<any, any> | null;
}

export interface FixedDecimalInputProps {
  amount: BigNumber | undefined;
  decimals: BigNumberish;
  setAmount: (newValue: BigNumber | undefined) => void;
  minAmount?: BigNumber | undefined;
  maxAmount?: BigNumber | undefined;
  children: (
    rawInputProps: RawInputProps
  ) => React.ReactElement<any, any> | null;
}

export interface WeiBoxProps {
  amount: BigNumber | undefined;
  decimals: BigNumberish;
  setAmount: (newValue: BigNumber | undefined) => void;
  // Dual mode enables both displays as textboxes, while int and fixed display one format or the other
  mode?: "dual" | "int" | "fixed";
  icon?: string | ReactNode | undefined;
  minAmount?: BigNumber | undefined;
  maxAmount?: BigNumber | undefined;
}

export const WeiInput: React.FC<WeiInputProps> = ({
  amount,
  setAmount,
  maxAmount,
  minAmount,
  children,
}) => {
  const [state, setState] = useState({
    baked: amount,
    raw: amount?.toString() ?? "",
    err: undefined as string | undefined,
  });

  useEffect(() => {
    if (!eqBigNumberOptions(amount, state.baked)) {
      setState({
        baked: amount,
        raw: amount !== undefined ? amount.toString() : state.raw,
        err: state.err,
      });
    }
  }, [state.raw, state.baked, state.err, amount]);

  const updateRawWeiAmount = useMemo(
    () => (newValue: string) => {
      const preparse = newValue.trim();
      let parsedAmount: BigNumber;
      try {
        parsedAmount = BigNumber.from(preparse);
        clampBigNumber(parsedAmount, minAmount, maxAmount);
      } catch {
        setState({
          baked: undefined,
          raw: preparse,
          err: "Invalid input",
        });
        if (amount !== undefined) {
          setAmount(undefined);
        }
        return;
      }
      setState({
        baked: parsedAmount,
        raw: preparse,
        err: undefined,
      });
      if (amount === undefined || amount?.eq(parsedAmount) === false) {
        setAmount(parsedAmount);
      }
    },
    [setState, setAmount, minAmount, maxAmount, amount]
  );

  return useMemo(
    () =>
      children({
        value: state.raw,
        setValue: updateRawWeiAmount,
        error: state.err !== undefined ? true : undefined,
        helperText: state.err,
      }),
    [state.raw, state.err, updateRawWeiAmount, children]
  );
};

// Caution: If the number of decimals changes during operation, the value will not be updated to track it
export const FixedDecimalInput: React.FC<FixedDecimalInputProps> = ({
  amount,
  decimals,
  setAmount,
  maxAmount,
  minAmount,
  children,
}) => {
  const [state, setState] = useState({
    baked: amount,
    raw: amount ? FixedNumber.fromValue(amount, decimals).toString() : "",
    err: undefined as string | undefined,
  });

  useEffect(() => {
    if (!eqBigNumberOptions(amount, state.baked)) {
      setState({
        baked: amount,
        raw:
          amount !== undefined
            ? FixedNumber.fromValue(amount, decimals).toString()
            : state.raw,
        err: state.err,
      });
    }
  }, [state.raw, state.baked, state.err, amount, decimals]);

  const updateRawFixedAmount = useMemo(
    () => (newValue: string) => {
      const preparse = newValue.trim();
      let parsedAmount: BigNumber;
      try {
        parsedAmount = parseFixed(preparse, decimals);
        clampBigNumber(parsedAmount, minAmount, maxAmount);
      } catch {
        setState({
          baked: undefined,
          raw: preparse,
          err: "Invalid input",
        });
        if (amount !== undefined) {
          setAmount(undefined);
        }
        return;
      }
      setState({
        baked: parsedAmount,
        raw: preparse,
        err: undefined,
      });
      if (amount === undefined || amount?.eq(parsedAmount) === false) {
        setAmount(parsedAmount);
      }
    },
    [setState, setAmount, minAmount, maxAmount, decimals, amount]
  );

  return useMemo(
    () =>
      children({
        value: state.raw,
        setValue: updateRawFixedAmount,
        error: state.err !== undefined ? true : undefined,
        helperText: state.err,
      }),
    [state.raw, state.err, updateRawFixedAmount, children]
  );
};

// TODO: Create a second component meant to be used alongside this one which displays USD value of the asset

// Caution: If the number of decimals changes during operation, the value will not be updated to track it
export const WeiBox: React.FC<WeiBoxProps> = ({
  amount,
  decimals,
  setAmount,
  maxAmount,
  minAmount,
  icon,
}) => {
  const [weiView, setWeiView] = React.useState(false);

  const leftElem = React.useMemo(
    () =>
      icon ? (
        <InputLeftElement
          h="100%"
          children={
            typeof icon === "string" ? (
              <>
                <Image
                  src={icon}
                  boxSize="3rem"
                  alt="Image left element for WeiBox"
                />
              </>
            ) : (
              icon
            )
          }
        />
      ) : null,
    [icon]
  );

  const rightElem = React.useMemo(
    () => (
      <InputRightElement width="4.5rem">
        {weiView ? " Wei" : " Tokens"}
        <Button
          h="100%"
          size="xl"
          background="transparent"
          color="white"
          fontWeight="bold"
          onClick={() => setWeiView(!weiView)}
          alt="Change input mode between Wei and decimal number of Tokens"
        >
          <RepeatIcon pointerEvents="none" />
        </Button>
        {maxAmount !== undefined ? (
          <>
            &nbsp;
            <Button
              h="100%"
              size="xl"
              background="transparent"
              color="white"
              fontWeight="bold"
              onClick={() => setAmount(maxAmount)}
            >
              MAX
            </Button>
          </>
        ) : null}
      </InputRightElement>
    ),
    [weiView, setWeiView, setAmount, maxAmount]
  );

  const inputElem = React.useMemo(
    () =>
      weiView ? (
        <WeiInput
          amount={amount}
          setAmount={setAmount}
          minAmount={minAmount}
          maxAmount={maxAmount}
        >
          {({ value, setValue, error }) => (
            <Input
              _hover={{ background: "primary.500" }}
              pr="4.5rem"
              variant="filled"
              background="secondary.900"
              placeholder="Enter amount"
              rounded="full"
              value={value}
              onChange={ev => setValue(ev.target.value)}
              isInvalid={error !== undefined}
            />
          )}
        </WeiInput>
      ) : (
        <FixedDecimalInput
          amount={amount}
          setAmount={setAmount}
          minAmount={minAmount}
          maxAmount={maxAmount}
          decimals={decimals}
        >
          {({ value, setValue, error }) => (
            <Input
              _hover={{ background: "primary.500" }}
              pr="4.5rem"
              variant="filled"
              background="secondary.900"
              placeholder="Enter amount"
              rounded="full"
              value={value}
              onChange={ev => setValue(ev.target.value)}
              isInvalid={error !== undefined}
            />
          )}
        </FixedDecimalInput>
      ),
    [weiView, amount, decimals, maxAmount, minAmount, setAmount]
  );

  return (
    <InputGroup size="lg">
      {leftElem}
      {inputElem}
      {rightElem}
    </InputGroup>
  );
};
