import React from "react";
import MoonLoader from "react-spinners/MoonLoader";

const override: React.CSSProperties = { position: "absolute", display: "block", zIndex: 1, margin: "15% 30% 15% 33%" };

const Loader: React.FC<{ size?: number | undefined }> = ({ size = 60 }) => {
  return (
    <MoonLoader cssOverride={override} size={size} color={"#0075FF"} loading={true} />
  );
};

export default Loader;
