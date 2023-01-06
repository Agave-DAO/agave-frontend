import React, { useEffect, useState, useMemo } from "react";
import { BigNumber, FixedNumber } from "ethers";
import { parseFixed } from "@ethersproject/bignumber";
import { Input, InputProps } from "@chakra-ui/react";

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

interface ITextInput extends InputProps {
  innerType: string,
  outerType: string,
  token: string,
}

function eqBigNumberOptions(
    a: BigNumber | undefined,
    b: BigNumber | undefined
): boolean {
    return !(a !== b && (a === undefined || b === undefined || !a.eq(b)));
}

const TextInput: React.FC<ITextInput> = props => {
  return (
      <Input
      fontSize={{ base:"20px", sm:"25px"}}
      height="27px"
      padding="0"
      rounded="0s"
      border="0"
      color="white"
      _focus={{ boxShadow:"0"}}
      borderBottom={props.innerType=="from"?"1px solid var(--chakra-colors-primary-900)":"0"}
      _hover={{borderBottom: props.innerType=="from"?"1px solid var(--chakra-colors-primary-900)":"0"}}
      boxShadow="0 !important"
      disabled={props.token=='' || props.innerType=='to'}
      _disabled={{opacity:(props.token!=''&&props.token!=='ag'?"1":"0.4")}}
      opacity={props.innerType=="to"?"0.7":"1"}
      />
  );
};

const FixedDecimalInput: React.FC<AmountInputProps> = ({
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
            setValue: updateRawFixedAmount,
            error: state.err !== undefined ? true : undefined,
            helperText: state.err,
          }),
        [state.raw, state.err, updateRawFixedAmount, children]
    );
};

export const AmountField: React.FC<{
  balance: BigNumber | undefined,
  setBalance: any,
  maxBalance: BigNumber | undefined,
  decimals: number,
  innerType: "to" | "from",
  outerType: "wrap" | "unwrap",
  token: string
}> = ({
  balance,
  setBalance,
  maxBalance,
  decimals,
  innerType,
  outerType,
  token
}) => {
  const amountField = React.useMemo(() => (
    <FixedDecimalInput 
        amount={balance}
        setAmount={setBalance}
        maxAmount={maxBalance}
        minAmount={BigNumber.from(0)}
        decimals={decimals}
    >
        {({ value, setValue, error }) => (
            <TextInput
            value={value}
            onChange={ev => setValue(ev.target.value)}
            isInvalid={error !== undefined}
            innerType={innerType}
            outerType={outerType}
            token={token}
            />
        )}                        
    </FixedDecimalInput>
  ),[balance, setBalance, maxBalance, decimals]);

  return amountField;
};