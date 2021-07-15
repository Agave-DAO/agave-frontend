import React from "react";
import { PercentageView } from "./PercentageView";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { fixedNumberToPercentage } from "../../utils/fixedPoint";

export const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);
  const variableDepositAPY = reserveProtocolData?.liquidityRate;
  console.log(reserveProtocolData, variableDepositAPY, tokenAddress)
  return React.useMemo(() => {
    if (variableDepositAPY === undefined) {
      return <>-</>;
    }

    return (
      <PercentageView ratio={fixedNumberToPercentage(variableDepositAPY, 7, 2)} />
    );
  }, [variableDepositAPY]);
};

export const BorrowAPRView: React.FC<{
  tokenAddress: string;
  isStable?: boolean | false;
}> = ({ tokenAddress, isStable }) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);

  const borrowRate = isStable
    ? reserveProtocolData?.stableBorrowRate
    : reserveProtocolData?.variableBorrowRate;

  return React.useMemo(() => {
    if (borrowRate === undefined) {
      return <>-</>;
    }

    return <PercentageView ratio={fixedNumberToPercentage(borrowRate, 4, 2)} />;
  }, [borrowRate]);
};
