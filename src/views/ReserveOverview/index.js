import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import Graph from "./Graph";
import ReserveInfo from "./ReserveInfo";
import UserInfo from "./UserInfo";
import { marketData } from "../../utils/constants";

/*
Agave Asset Page Notes | React Template Edited by Pauly Sun 🌞 June 25th, 2021 
Data Simulated and pulled from utils -> constants.tsx 
All dependences pulled through components found in views -> ReserveOverview 
Todos... 
*Ready For Query Injection 
**Not Mobile Ready, In progress 
***Needs to be connected to markets page through router, currently only works by manual url rougting EG... 
/reserve-overview/ETH
*/

const ReserveOverviewWrapper = styled.div`
  .content-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    padding-bottom: 10px;

    .user-info {
      width: 440px;
      display: flex;
      flex-direction: column;
    }
  }
`;

function ReserveOverview({ match }) {
  const [crypto, setCrypto] = useState("");

  useEffect(() => {
    if (match.params && match.params.assetName) {
      setCrypto(marketData.find(item => item.name === match.params.assetName));
    }
  }, [match]);

  return (
    <ReserveOverviewWrapper>
      {/* <Graph /> */}
      <div className="content-wrapper">
        <ReserveInfo asset={crypto} />
        <UserInfo asset={crypto} />
      </div>
    </ReserveOverviewWrapper>
  );
}

export default withRouter(ReserveOverview);
