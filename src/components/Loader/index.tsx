import React from 'react';
import { css } from "@emotion/core";
import MoonLoader from "react-spinners/MoonLoader";

const override = css`
  position: absolute;
  display: block;
  z-index: 1;
  margin: 15% 30% 15% 33%;
`;

const Loader: React.FC<{ size?: number | undefined, }> = ({ size = 60 }) => {
    return (
        <MoonLoader
            css={override}
            size={size}
            color={"#0075FF"}
            loading={true}
        />
    );
}

export default Loader;
