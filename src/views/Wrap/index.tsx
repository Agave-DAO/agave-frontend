import React, { useEffect, useState } from "react";
import { WrapLayout } from "./layout";

export interface IWrap {}

export const Wrap: React.FC<IWrap> = () => {
    return React.useMemo(() => (
        <WrapLayout />
    ),[]);
};