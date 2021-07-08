import React from "react";
import { Text } from "@chakra-ui/layout";

export const PercentageView: React.FC<{
  lowerIsBetter?: boolean;
  positiveOnly?: boolean;
  value: number;
}> = ({
  lowerIsBetter,
  value,
  positiveOnly
}) => {
  if (lowerIsBetter) {
      throw new Error('PercentageView Mode "lowerIsBetter" not yet supported');
  }
  if (positiveOnly) {
      throw new Error('PercentageView Mode "positiveOnly" not yet supported');
  }
  return (
      <Text fontWeight="bold" color={value >= 0 ? "yellow.100" : "red.600"}>
      % {(value * 100).toFixed(2)}
      </Text>
);
};