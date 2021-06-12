import React from "react";
import { VStack } from "@chakra-ui/layout";
import { useRouteMatch, withRouter } from "react-router-dom";
import { useAsset } from "../../hooks/asset";
import { useBalance } from "../../hooks/balance";
import DepositDash from "../common/DepositDash"
import DashOverview from "../common/DashOverview"

const DepositDetail: React.FC = () => {
  const match = useRouteMatch<{
    assetName: string | undefined,
  }>();
  const assetName = match.params.assetName;
  const { asset } = useAsset(assetName);
  const { library, address } = useBalance(asset);
  if (!asset) {
    return <>No asset found with details </>;
  }

  if (!address || !library) {
    return <>No account loaded</>;
  }

  return (
    <VStack color="white" spacing="3.5rem" mt="3.5rem" minH="65vh">
      <DepositDash 
        agaveBalance={3.31}
        walletBalance={3.2}
        healthFactor={12}
        utilRate={2}
        liquidityAvailable={123}
        isCollateralized={true}
        maxLTV={123}
        assetPrice={333}
        depositAPY={1122}
      />
      <DashOverview mode="deposit" />
    </VStack>
  );
};

export default withRouter(DepositDetail);
