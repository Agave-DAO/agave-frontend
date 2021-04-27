import React from "react";
import styled from "styled-components";
import { useRouteMatch, withRouter } from "react-router-dom";
import Page from "../../components/Page";
import { useAsset } from "../../hooks/asset";
import { useBalance } from "../../hooks/balance";
// import { internalAddresses } from "../../utils/contracts/contractAddresses/internalAddresses";

import BorrowOverview from "./BorrowOverview";
import { ActionDetail } from "../../components/Actions/ActionDetail";

const BorrowDetailWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const BorrowDetail: React.FC = () => {
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
      <BorrowDetailWrapper>
        <BorrowOverview asset={asset} />
        <ActionDetail asset={asset} balance={balance} actionName="borrow" actionBaseRoute="borrow" />
      </BorrowDetailWrapper>
    </Page>
  );
};

export default withRouter(BorrowDetail);
