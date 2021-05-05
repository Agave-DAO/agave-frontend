import React from "react";
import styled from "styled-components";
import { useRouteMatch, withRouter } from "react-router-dom";
import Page from "../../components/Page";
import { useAsset } from "../../hooks/asset";
import { useBalance } from "../../hooks/balance";

import DepositWithdrawOverview from "./DepositWithdrawOverview"
import { ActionDetail } from "../../components/Actions/ActionDetail";

const DepositWithdrawDetailWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const DepositWithdrawDetail: React.FC = () => {
  const match = useRouteMatch<{
    assetName: string | undefined,
    action: string,
  }>();
  const { assetName, action } = match.params;
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
      <DepositWithdrawDetailWrapper>
        <DepositWithdrawOverview asset={asset} />
        <ActionDetail asset={asset} balance={balance} actionName={action} actionBaseRoute={action} />
      </DepositWithdrawDetailWrapper>
    </Page>
  );
};

export default withRouter(DepositWithdrawDetail);
