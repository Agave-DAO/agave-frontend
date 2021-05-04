import React from "react";
import styled from "styled-components";
import { useRouteMatch, withRouter } from "react-router-dom";
import Page from "../../components/Page";
import { useAsset } from "../../hooks/asset";
import { useBalance } from "../../hooks/balance";

import WithdrawOverview from "./WithdrawOverview"
import { ActionDetail } from "../../components/Actions/ActionDetail";

const WithdrawDetailWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const WithdrawDetail: React.FC = () => {
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
      <WithdrawDetailWrapper>
        <WithdrawOverview asset={asset} />
        <ActionDetail asset={asset} balance={balance} actionName="withdraw" actionBaseRoute="withdraw" />
      </WithdrawDetailWrapper>
    </Page>
  );
};

export default withRouter(WithdrawDetail);
