import { BigNumberish, parseFixed } from "@ethersproject/bignumber";
import { BigNumber, FixedNumber } from "ethers";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Box, Input } from "@chakra-ui/react";

const WeiBoxWrapper = styled.div`
  margin-bottom: 20px;
  width: 100%;
  border: 1px solid ${(props) => props.theme.color.textPrimary};
  padding: 15px;
  border-radius: 2px;
  display: flex;
  justify-content: space-between;

  .content-label {
    font-weight: 400;
    color: ${(props) => props.theme.color.textPrimary};
  }

  .content-value {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    .token-amount {
      display: flex;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        margin-right: 5px;
      }

      span {
        font-size: 16px;
      }
    }

    .usd-amount {
      font-size: 10px;
    }
  }
`;

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
  icon?: ReactNode | undefined;
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
}) => {
  return (
    <Box>
      <FixedDecimalInput
        amount={amount}
        setAmount={setAmount}
        minAmount={minAmount}
        maxAmount={maxAmount}
        decimals={decimals}
      >
        {({ value, setValue, error }) => (
          <Input
            label="Tokens"
            variant="outlined"
            error={error}
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
          />
        )}
      </FixedDecimalInput>
      <WeiInput
        amount={amount}
        setAmount={setAmount}
        minAmount={minAmount}
        maxAmount={maxAmount}
      >
        {({ value, setValue, error }) => (
          <Input
            label="Wei"
            variant="outlined"
            error={error}
            value={value}
            onChange={(ev) => setValue(ev.target.value)}
            type="number"
          />
        )}
      </WeiInput>
    </Box>
  );
};
