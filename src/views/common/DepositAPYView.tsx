import React from "react";
import { PercentageView } from "./PercentageView"
import { useProtocolReserveData } from "../../queries/protocolReserveData";

export const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const { data: reserveProtocolData } = useProtocolReserveData(tokenAddress);
  const variableDepositAPY = reserveProtocolData?.variableBorrowRate;
  
  return React.useMemo(() => {
    if (variableDepositAPY === undefined) {
      return <>-</>;
    }
    
    return <PercentageView value={(variableDepositAPY.toUnsafeFloat() * 100)} />;
  }, [variableDepositAPY]);
};
