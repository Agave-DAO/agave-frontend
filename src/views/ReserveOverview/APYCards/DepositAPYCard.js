import React from 'react';
import Card from '../../../components/Card';

function DepositAPYCard({type}) {
  return (
    <Card color="orange">
      <div className="apycard-title">
        Deposit
      </div>
      <div className="apycard-content">
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>Deposit APY</span>
          </div>
          <div className="apycard-value">
            <span>0.03 %</span>
          </div>
        </div>
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>Past 30D Avg.</span>
          </div>
          <div className="apycard-value">
            <span>—</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DepositAPYCard;
