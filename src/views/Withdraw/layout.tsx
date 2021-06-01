import { Center, Text, VStack } from "@chakra-ui/layout";
import React, { useEffect, useState } from "react";
import DashOverview from "../common/DashOverview";
import DepositDash from "../common/DepositDash";

export const WithdrawBanner: React.FC = () => {
  return (
    <Center justifyContent="flex-start" w="100%">
      <Text fontSize="2.4rem" fontWeight="bold">
        Withdraw XDAI
      </Text>
    </Center>
  );
};

const WithdrawLayout: React.FC = () => {
  const [step, setStep] = useState<number>(1);

  useEffect(() => {
    // This would probably be used if user refreshes, and needed to update the step.
    // setStep(3);
  }, []);

  return (
    <VStack spacing="3.5rem" mt="3.5rem">
      <DepositDash />
      <DashOverview mode="withdraw" />
    </VStack>
  );
};

export default WithdrawLayout;
