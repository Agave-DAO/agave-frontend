import { QuestionIcon } from "@chakra-ui/icons";
import { Image, ImageProps } from "@chakra-ui/image";
import AgaveLogo from "../assets/image/coins/agave.webp";
import WxdaiLogo from "../assets/image/coins/wxdai.svg";
import EthLogo from "../assets/image/coins/eth.svg";
import HoneyLogo from "../assets/image/coins/honey.webp";
import UsdcLogo from "../assets/image/coins/usdc.svg";
import UsdtLogo from "../assets/image/coins/usdt.svg";
import WbtcLogo from "../assets/image/coins/wbtc.svg";
import LinkLogo from "../assets/image/coins/link.webp";
import StakeLogo from "../assets/image/coins/xdai-stake.svg";
import GnoLogo from "../assets/image/coins/gno.webp";
import FoxLogo from "../assets/image/coins/fox.svg";
import EureLogo from "../assets/image/coins/eure.svg";
import React, { MouseEventHandler } from "react";
import { SquareProps, Circle, Center } from "@chakra-ui/react";
import { useAppWeb3 } from "../hooks/appWeb3";
import { getChainAddresses } from "../utils/chainAddresses";

export function imageForTokenSymbol(symbol: string): string | null {
  switch (symbol) {
    case "AGVE":
    case "agAGVE":
      return AgaveLogo;
    case "WXDAI":
    case "XDAI":
    case "agWXDAI":
    case "wagWXDAI":
      return WxdaiLogo;
    case "ETH":
    case "WETH":
    case "agWETH":
    case "wagWETH":
      return EthLogo;
    case "HONEY":
    case "HNY":
      return HoneyLogo;
    case "USDC":
    case "agUSDC":
    case "wagUSDC":
      return UsdcLogo;
    case "STAKE":
    case "agSTAKE":
      return StakeLogo;
    case "USDT":
    case "agUSDT":
    case "wagUSDT":
      return UsdtLogo;
    case "BTC":
    case "WBTC":
    case "agWBTC":
    case "wagWBTC":
      return WbtcLogo;
    case "LINK":
    case "agLINK":
      return LinkLogo;
    case "GNO":
    case "agGNO":
    case "wagGNO":
      return GnoLogo;
    case "FOX":
    case "agFOX":
      return FoxLogo;
    case "EURe":
    case "agEURe":
    case "wagEURe":
      return EureLogo;
    default:
      return null;
  }
}

export const TokenIcon: React.FC<{ symbol: string } & ImageProps> = ({
  symbol,
  ...imageProps
}) => {
  return React.useMemo(() => {
    const svg = imageForTokenSymbol(symbol);
    if (svg === null) {
      return <QuestionIcon w="24px" h="24px" />;
    }
    return <Image src={svg} width="14" height="14" alt="?" {...imageProps} />;
  }, [symbol, imageProps]);
};

export function useNativeSymbols(): {
  native: string;
  wrappednative: string;
} {
  const w3 = useAppWeb3();
  const chainId = w3.chainId ?? 100;
  const chainAddresses = getChainAddresses(chainId);
  if (!chainAddresses) {
    return { native: "ETH", wrappednative: "WETH" }; //hardcoded until better solution to avoid undefined as output
  }
  const nativeSymbol = chainAddresses.symbol;
  const wrappedNativeSymbol = "W" + nativeSymbol;
  return { native: nativeSymbol, wrappednative: wrappedNativeSymbol };
}

export const ModalIcon: React.FC<{ onOpen: MouseEventHandler } & SquareProps> =
  ({ onOpen, ...props }) => {
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
