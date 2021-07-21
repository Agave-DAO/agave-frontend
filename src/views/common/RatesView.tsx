import React from "react";
import { Text } from "@chakra-ui/react";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { fixedNumberToPercentage } from "../../utils/fixedPoint";

export const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);
  const variableDepositAPY = reserveProtocolData?.liquidityRate;
  return React.useMemo(() => {
    if (variableDepositAPY === undefined) {
      return <>-</>;
    }

    return <Text>{fixedNumberToPercentage(variableDepositAPY, 7, 2)}%</Text>;
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

    return <Text>{fixedNumberToPercentage(borrowRate, 4, 2)}%</Text>;
  }, [borrowRate]);
};
