import React, { useEffect, useState, useMemo } from "react";
import { BigNumber, FixedNumber } from "ethers";
import { parseFixed } from "@ethersproject/bignumber";

export interface RawInputProps {
    value: string;
    setValue: (newRawAmount: string) => void;
    error?: boolean | undefined;
    helperText?: string | undefined;
}

export interface AmountInputProps {
    amount: BigNumber | undefined;
    decimals: number;
    setAmount: (newValue: BigNumber | undefined) => void;
    minAmount?: BigNumber | undefined;
    maxAmount?: BigNumber | undefined;
    children: (
      rawInputProps: RawInputProps
    ) => React.ReactElement<any, any> | null;
}

function eqBigNumberOptions(
    a: BigNumber | undefined,
    b: BigNumber | undefined
): boolean {
    return !(a !== b && (a === undefined || b === undefined || !a.eq(b)));
}

export const AmountField: React.FC<AmountInputProps> = ({
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

    const updateRawAmount = useMemo(
        () => (newValue: string) => {

            const preparse = newValue.trim();
            let parsedAmount: BigNumber;

            try {
              parsedAmount = parseFixed(preparse, decimals);

              if (maxAmount && parsedAmount.gt(maxAmount)) {
                parsedAmount = maxAmount;
                throw true;
              }
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
            setValue: updateRawAmount,
            error: state.err !== undefined ? true : undefined,
            helperText: state.err,
          }),
        [state.raw, state.err, updateRawAmount, children]
    );
};
