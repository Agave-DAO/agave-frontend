import React from "react";
import { useProtocolReserveData } from "../../queries/protocolReserveData";
import { fixedNumberToPercentage } from "../../utils/fixedPoint";
import { PercentageView } from "./PercentageView";
import {
  NATIVE_TOKEN,
  useTokenDefinitionByAddress,
} from "../../queries/allReserveTokens";
import { AssetRecord } from "../Markets";
import { useWrappedNativeAddress } from "../../queries/wrappedNativeAddress";

export const DepositAPYView: React.FC<{ tokenAddress: string }> = ({
  tokenAddress,
}) => {
  const wNative = useWrappedNativeAddress().data;
  const asset = tokenAddress !== typeof NATIVE_TOKEN ? tokenAddress : wNative;
  const assetDef = useTokenDefinitionByAddress(asset);
  const { data: reserveProtocolData } = useProtocolReserveData(assetDef.token);
  const variableDepositAPY = reserveProtocolData?.liquidityRate;
  return React.useMemo(() => {
    if (variableDepositAPY === undefined) {
      return <>-</>;
    }

    return (
      <PercentageView
        ratio={fixedNumberToPercentage(variableDepositAPY, 3, 2)}
      />
    );
  }, [variableDepositAPY]);
};

export const BorrowAPRView: React.FC<{
  tokenAddress: string;
  isStable?: boolean | false;
}> = ({ tokenAddress, isStable }) => {
  const asset = useTokenDefinitionByAddress(tokenAddress);
  const { data: reserveProtocolData } = useProtocolReserveData(asset.token);

  const borrowRate = isStable
    ? reserveProtocolData?.stableBorrowRate
    : reserveProtocolData?.variableBorrowRate;

  return React.useMemo(() => {
    if (borrowRate === undefined) {
      return <>-</>;
    }

    return <PercentageView ratio={fixedNumberToPercentage(borrowRate, 3, 2)} />;
  }, [borrowRate]);
};
