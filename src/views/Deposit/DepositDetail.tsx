import React from "react";
import styled from "styled-components";
import { useRouteMatch, withRouter } from "react-router-dom";
import Page from "../../components/Page";
import { useAsset } from "../../hooks/asset";
import { useBalance } from "../../hooks/balance";
// import { internalAddresses } from "../../utils/contracts/contractAddresses/internalAddresses";

import DepositOverview from "./DepositOverview";
import { ActionDetail } from "../../components/Actions/ActionDetail";

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
    <Page>
      <DepositDetailWrapper>
        <DepositOverview asset={asset} />
        <ActionDetail asset={asset} balance={balance} actionName="deposit" actionBaseRoute="deposit" />
      </DepositDetailWrapper>
    </Page>
  );
};

export default withRouter(DepositDetail);
