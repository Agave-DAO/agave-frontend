import React from 'react';
import Card from '../../../components/Card';

function VariableBorrowAPYCard({type}) {
  return (
    <Card color="blue">
      <div className="apycard-title">
        Variable Borrowing
      </div>
      <div className="apycard-content">
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>Borrow APR</span>
          </div>
          <div className="apycard-value">
            <span>0.43 %</span>
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
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>% over total</span>
          </div>
          <div className="apycard-value">
            <span>99.92 %</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default VariableBorrowAPYCard;
