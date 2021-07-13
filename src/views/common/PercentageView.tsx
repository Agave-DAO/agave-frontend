import React from "react";
import { Text } from "@chakra-ui/layout";

export const PercentageView: React.FC<{
  lowerIsBetter?: boolean;
  positiveOnly?: boolean;
  ratio: number;
}> = ({
  lowerIsBetter,
  ratio,
  positiveOnly
}) => {
  if (lowerIsBetter) {
      throw new Error('PercentageView Mode "lowerIsBetter" not yet supported');
  }
  if (positiveOnly) {
      throw new Error('PercentageView Mode "positiveOnly" not yet supported');
  }
  return (
      <Text fontWeight="bold" color={ratio >= 0 ? "yellow.100" : "red.600"}>
      % {ratio * 100 }
      </Text>
);
};
