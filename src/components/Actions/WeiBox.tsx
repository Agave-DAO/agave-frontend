import { BigNumberish, parseFixed } from "@ethersproject/bignumber";
import { BigNumber, FixedNumber } from "ethers";
import React, { ReactNode, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

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

export interface WeiBoxProps {
  amount: BigNumber | undefined;
  decimals: number;
  setAmount: (newValue: BigNumber | undefined) => void;
  // Dual mode enables both displays as textboxes, while int and fixed display one format or the other
  mode?: "dual" | "int" | "fixed";
  icon?: ReactNode | undefined;
  minAmount?: BigNumber | undefined;
  maxAmount?: BigNumber | undefined;
}

// TODO: Create a second component meant to be used alongside this one which displays USD value of the asset

function parseWholeTokensFixed(value: string, decimals: BigNumberish): BigNumber {
  throw new Error();
}

function clampBigNumber(value: BigNumberish, minAmount: BigNumber | undefined, maxAmount: BigNumber | undefined): BigNumber {
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

// Caution: If the number of decimals changes during operation, the value will not be updated to track it
export const WeiBox: React.FC<WeiBoxProps> = ({ amount, decimals, setAmount, maxAmount, minAmount, }) => {
  const [rawWeiAmount, setRawWeiAmount] = useState(amount?.toString() ?? "");
  const [rawFixedAmount, setRawFixedAmount] = useState(amount ? FixedNumber.fromValue(amount, decimals).toString() : "");

  const clampValue = useMemo(() => (value: BigNumberish) => clampBigNumber(value, minAmount, maxAmount), [minAmount, maxAmount]);

  type InputChangeEvent = React.ChangeEvent<HTMLInputElement>;
  const updateRawWeiAmountFromEvent = useMemo(() => (ev: InputChangeEvent) => {
    if (rawWeiAmount != ev.target.value) { setRawWeiAmount(ev.target.value.trim()); }
    let parsedAmount: BigNumber;
    try {
      parsedAmount = BigNumber.from(ev.target.value.trim());
    } catch {
      if (amount !== undefined) {
        setAmount(undefined);
      }
      return;
    }
    if (amount === undefined || amount?.eq(parsedAmount) === false) {
      setAmount(parsedAmount);
    }
    const newRawAmount = FixedNumber.fromValue(parsedAmount, decimals).toString();
    if (rawFixedAmount != newRawAmount) {
      setRawFixedAmount(newRawAmount);
    }
  }, [rawWeiAmount, rawFixedAmount, setRawWeiAmount, setRawFixedAmount, setAmount, clampValue]);

  const updateRawFixedAmountFromEvent = useMemo(() => (ev: InputChangeEvent) => {
    if (rawFixedAmount != ev.target.value) { setRawFixedAmount(ev.target.value.trim()); }
    let parsedAmount: BigNumber;
    try {
      parsedAmount = parseFixed(ev.target.value.trim(), decimals);
    } catch {
      if (amount !== undefined) {
        setAmount(undefined);
      }
      return;
    }
    if (amount === undefined || amount?.eq(parsedAmount) === false) {
      setAmount(parsedAmount);
    }
    const newRawAmount = parsedAmount.toString();
    if (rawWeiAmount != newRawAmount) {
      setRawWeiAmount(newRawAmount);
    }
  }, [rawFixedAmount, rawWeiAmount, setRawFixedAmount, setRawWeiAmount, setAmount, clampValue, decimals]);

  return (
    <WeiBoxWrapper>
      <div className="content-label">Amount</div>
      <div className="content-value">
        <span className="token-amount">
          Tokens: <input value={rawFixedAmount} onChange={updateRawFixedAmountFromEvent}/>
          Wei: <input value={rawWeiAmount} onChange={updateRawWeiAmountFromEvent} />
        </span>
      </div>
    </WeiBoxWrapper>
  );
};
