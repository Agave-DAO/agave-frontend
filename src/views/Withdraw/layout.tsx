import { Center, Text, VStack } from "@chakra-ui/layout";
import { BigNumber } from "ethers";
import React from "react";
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
  return (
    <VStack color="white" spacing="3.5rem" mt="3.5rem" minH="65vh">
      {/* <DepositDash
        healthFactor={3.91}
        assetPrice={BigNumber.from(1)}
        utilRate={38.42}
        agaveBalance={BigNumber.from(362)}
        walletBalance={BigNumber.from(4883)}
        isCollateralized={true}
        maxLTV={50}
        depositAPY={11.07}
        liquidityAvailable={BigNumber.from(223362346)}
      /> */}
      <DashOverview mode="withdraw" />
    </VStack>
  );
};

export default WithdrawLayout;
