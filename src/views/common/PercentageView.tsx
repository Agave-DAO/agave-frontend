import React from "react";
import { Text } from "@chakra-ui/layout";

export const PercentageView: React.FC<{
  lowerIsBetter?: boolean;
  positiveOnly?: boolean;
  ratio: string;
}> = ({ lowerIsBetter, ratio, positiveOnly }) => {
  if (lowerIsBetter) {
    throw new Error('PercentageView Mode "lowerIsBetter" not yet supported');
  }
  if (positiveOnly) {
    throw new Error('PercentageView Mode "positiveOnly" not yet supported');
  }
  return (
    <Text fontWeight="bold" color={"yellow.100"}>
      {ratio} %
    </Text>
  );
};
