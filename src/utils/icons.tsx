import { QuestionIcon } from "@chakra-ui/icons";
import AgaveLogo from "../assets/image/colored-agave-logo.svg";
import BatLogo from "../assets/image/coins/bat.svg";
import DaiLogo from "../assets/image/coins/dai.svg";
import EthLogo from "../assets/image/coins/eth.svg";
import HoneyLogo from "../assets/image/logo.svg";
import UniLogo from "../assets/image/coins/uni.svg";
import UsdcLogo from "../assets/image/coins/usdc.svg";
import UsdtLogo from "../assets/image/coins/usdt.svg";
import WbtcLogo from "../assets/image/coins/wbtc.svg";
import ZrxLogo from "../assets/image/coins/zrx.svg";
import React from "react";

export const TokenIcon: React.FC<{ symbol: string }> = ({ symbol }) => {
  return React.useMemo(() => {
    let svg;
    switch (symbol) {
      case "AGVE":
        svg = AgaveLogo;
        break;
      case "BAT":
        svg = BatLogo;
        break;
      case "DAI":
        svg = DaiLogo;
        break;
      case "ETH":
      case "WETH":
        svg = EthLogo;
        break;
      case "HONEY":
      case "HNY":
        svg = HoneyLogo;
        break;
      case "UNI":
        svg = UniLogo;
        break;
      case "USDC":
        svg = UsdcLogo;
        break;
      case "USDT":
        svg = UsdtLogo;
        break;
      case "BTC":
      case "WBTC":
        svg = WbtcLogo;
        break;
      case "ZRX":
        svg = ZrxLogo;
        break;
      default:
        return <QuestionIcon w="24px" h="24px" />;
    }
    return <img src={svg} width="24" height="24" />;
  }, [symbol]);
};
