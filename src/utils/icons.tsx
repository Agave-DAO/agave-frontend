import { QuestionIcon } from "@chakra-ui/icons";
import { Image, ImageProps } from "@chakra-ui/image";
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
import React, { MouseEventHandler } from "react";
import { SquareProps, Circle, Center } from "@chakra-ui/react";

export const TokenIcon: React.FC<{ symbol: string } & ImageProps> = ({
  symbol,
  ...imageProps
}) => {
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
    return (
      <Image
        src={svg}
        width="24"
        height="24"
        alt="token icon"
        {...imageProps}
      />
    );
  }, [symbol, imageProps]);
};

export const ModalIcon: React.FC<
  { onOpen: MouseEventHandler } & SquareProps
> = ({ onOpen, ...props }) => {
  return React.useMemo(
    () => (
      <Circle
        borderWidth={{ base: "1px", md: "2px" }}
        width={{ base: "1.2rem", md: "1.5rem" }}
        minHeight={{ base: "1.2rem", md: "1.5rem" }}
        boxSizing="content-box"
        as={Center}
        fontSize={{ base: ".85rem", md: "1rem" }}
        color="yellow.100"
        borderColor="yellow.100"
        position="absolute"
        top={{ base: "0.75rem", md: "1rem" }}
        right={{ base: "0.75rem", md: "1rem" }}
        cursor="pointer"
        onClick={onOpen}
        {...props}
      >
        ?
      </Circle>
    ),
    [onOpen, props]
  );
};
