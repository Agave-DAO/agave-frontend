import React, { useState } from 'react';
import {DepositLayout} from './layout';

function Deposit() {
  const [activeValue, setActiveValue] = useState<"All" | "Stable Coins">('All');

  const handleSetActiveValue = (value: ("All" | "Stable Coins")) => {
    setActiveValue(value)
  }
  return (
    <div>
      <DepositLayout
        activeValue={activeValue}
        setActiveValue={(value) => {handleSetActiveValue(value)}}
      />
    </div>
  );
}

export default Deposit;
