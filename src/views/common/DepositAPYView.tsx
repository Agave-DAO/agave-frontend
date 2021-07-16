import React from "react";
import { PercentageView } from "./PercentageView"
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { fixedNumberToPercentage } from "../../utils/fixedPoint"



export const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);
  // if it's an aToken this will return null. Handle it differently!
  const variableDepositAPY = reserveProtocolData?.variableBorrowRate;
  
  return React.useMemo(() => {
    if (variableDepositAPY === undefined) {
      return <>-</>;
    }

    return <PercentageView ratio={fixedNumberToPercentage(variableDepositAPY, 3)} />;

  }, [variableDepositAPY]);
};
