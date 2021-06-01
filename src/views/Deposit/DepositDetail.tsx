import React from "react";
import styled from "styled-components";
import { useRouteMatch, withRouter } from "react-router-dom";
import { useAsset } from "../../hooks/asset";
import { useBalance } from "../../hooks/balance";
import DepositOverview from "./DepositOverview";
import DepositActionHolder from "./DepositFlow/DepositActionHolder";

const DepositDetailWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DepositDetail: React.FC = () => {
  const match = useRouteMatch<{
    assetName: string | undefined,
  }>();
  const assetName = match.params.assetName;
  const { asset } = useAsset(assetName);
  const { library, address, balance } = useBalance(asset);
  if (!asset) {
    return <>No asset found with details </>;
  }

  if (!address || !library) {
    return <>No account loaded</>;
  }

  return (
    <DepositDetailWrapper>
      <DepositOverview
        asset={asset}
        agaveBalance={200.22}
        walletBalance={4883.33}
        healthFactor={3.91}
        utilizationRate={38.4}
        availableLiquidity={223362.22}
        depositAPY={11.07}
        usedAsCollateral={true}
        assetPrice={50}
        maxLTV={1003}
      />
      <DepositActionHolder />
    </DepositDetailWrapper>
  );
};

export default withRouter(DepositDetail);
