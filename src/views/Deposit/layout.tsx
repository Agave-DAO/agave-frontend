import { Center, Text, VStack } from "@chakra-ui/layout";
import React from "react";
import DashOverview from "../common/DashOverview";
import DepositDash from "../common/DepositDash";

export const DepositBanner: React.FC = () => {
  return (
    <Center justifyContent="flex-start" w="100%">
      <Text fontSize="2.4rem" fontWeight="bold">
        Deposit XDAI
      </Text>
    </Center>
  );
};

const DepositLayout: React.FC = () => {
  return (
    <VStack color="white" spacing="3.5rem" mt="3.5rem" minH="65vh">
      <DepositDash />
      <DashOverview mode="deposit" />
    </VStack>
  );
};

export default DepositLayout;
