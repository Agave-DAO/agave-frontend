import React, { useEffect, useState } from "react";
import Card from "../../../components/Card";

function DepositAPYCard({ type }) {
  // Default Componate States
  const [depositAPY, setDepositAPY] = useState("0");
  const [avg, setAvg] = useState("~");

  // Update Componate States // TODO input real data
  useEffect(() => {
    setDepositAPY(0.03);
    setAvg("~");
  }, []);

  return (
    <Card color="yellow">
      <div className="apycard-title">Deposit</div>
      <div className="apycard-content">
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>Deposit APY</span>
          </div>
          <div className="apycard-value">
            <span>{depositAPY} %</span>
          </div>
        </div>
        <div className="apycard-content-row">
          <div className="apycard-label">
            <span>Past 30D Avg.</span>
          </div>
          <div className="apycard-value">
            <span>{avg}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default DepositAPYCard;
