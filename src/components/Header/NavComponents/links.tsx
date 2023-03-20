import React from "react";
import { NavTabLink } from "./tab-link-style";

export const Links: React.FC<{}> = () => {
  return (
    <>
      <NavTabLink exact to="/dashboard">
        DASHBOARD
      </NavTabLink>
      <NavTabLink exact to="/markets">
        MARKETS
      </NavTabLink>
      <NavTabLink exact to="/borrow">
        BORROW
      </NavTabLink>
      <NavTabLink exact to="/deposit">
        DEPOSIT
      </NavTabLink>
      <NavTabLink exact to="/stake">
        STAKE
      </NavTabLink>
      <NavTabLink exact to="/wrap">
        WRAP
      </NavTabLink>
    </>
  );
};
