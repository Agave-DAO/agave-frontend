import React, { useMemo, useState } from "react";
import {
  Text,
  Center,
  Button,
  Badge,
  Image,
  useColorMode,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { Navbar } from "./navbar";
import agaveLogo from "../../assets/image/agave-logo.svg";
import darkMoon from "../../assets/image/dark-moon.svg";
import lightMoon from "../../assets/image/light-moon.svg";
import { selectAddress } from "../../features/auth/authSlice";
import { useAppSelector } from "../../redux/hooks";
import { NavLink } from "react-router-dom";
import { NavTabLink } from "./tab-link";
import { bigNumberToString } from "../../utils/fixedPoint";
import { useUserAssetBalance } from "../../queries/userAssets";
import { useAllReserveTokensWithData } from "../../queries/lendingReserveData";
import { store as NotificationManager } from "react-notifications-component";
import { useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../../hooks/injectedConnectors";

function Header() {
  // Light/Dark button functions
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const { colorMode, toggleColorMode } = useColorMode();

  // Address button functions
  const address: string | undefined = useAppSelector(selectAddress);
  const addressPretty = useMemo(
    () =>
      address
        ? `${address.substring(0, 4)}...${address.substring(
            address.length - 4,
            address.length
          )}`
        : undefined,
    [address]
  );

  // Agve button functions
  const reserves = useAllReserveTokensWithData()?.data;
  const reserve = React.useMemo(
    () =>
      reserves?.find(reserve => reserve?.symbol === "AGVE") ??
      reserves?.find(reserve => reserve.tokenAddress),
    [reserves]
  );
  const tokenBalance = useUserAssetBalance(reserve?.tokenAddress)?.data;
  const userBal = tokenBalance ? bigNumberToString(tokenBalance) : "0";

  // Connect button functions
  function warnUser(title: string, message?: string | undefined): void {
    NotificationManager.addNotification({
      container: "top-right",
      type: "warning",
      title,
      message,
    });
  }
  const { activate, error } = useWeb3React();
  const onMetamaskConnect = async () => {
    if (typeof (window as any).ethereum === "undefined") {
      warnUser(
        "Please install MetaMask!",
        "Agave requires Metamask to be installed in your browser to work properly."
      );
      return;
    }
    await activate(injectedConnector);
  };

  return (
    <Navbar>
      <Navbar.Brand>
        <Center as={NavLink} to="/" marginEnd={6}>
          <Image
            src={agaveLogo}
            alt="AGAVE ALT"
            width={{ base: "35px", md: "inherit" }}
          />
          <Text
            color="white"
            ml={4}
            mt={{ base: "2.5", md: "1" }}
            fontWeight="bold"
            fontSize={{ base: "4xl", md: "2xl" }}
          >
            AGAVE
          </Text>
        </Center>
      </Navbar.Brand>
      <Navbar.Links>
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
      </Navbar.Links>
      <Navbar.UserProfile>
        <Center
          width={{ base: "4rem", md: "3rem" }}
          height={{ base: "4rem", md: "3rem" }}
          rounded="lg"
          bg={mode({ base: "primary.800", md: "primary.500" }, "primary.500")}
          cursor="pointer"
          // display="none"
          onClick={toggleColorMode}
        >
          <Image
            src={colorMode === "dark" ? darkMoon : lightMoon}
            alt="theme-mode"
          />
        </Center>
        <Center
          minWidth="10rem"
          height={{ base: "4rem", md: "3rem" }}
          fontSize={{ base: "3xl", md: "2xl" }}
          mx="1.5rem"
          textTransform="uppercase"
          color="white"
          bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
          rounded="lg"
        >
          {userBal.substring(0, 4)} AGVE
        </Center>
        {addressPretty ? (
          <Center
            background={mode(
              { base: "secondary.800", md: "primary.500" },
              "primary.500"
            )}
            rounded="lg"
            minWidth="10rem"
            height={{ base: "4rem", md: "3rem" }}
            color="white"
            p="10px"
          >
            <Badge
              bg="yellow"
              rounded="full"
              width={{ base: "1.3rem", md: "1rem" }}
              height={{ base: "1.3rem", md: "1rem" }}
              mr="5px"
            />
            <Text fontSize={{ base: "3xl", md: "2xl" }}>{addressPretty}</Text>
          </Center>
        ) : (
          <Button
            background="primary.500"
            rounded="lg"
            minWidth="10rem"
            height={{ base: "4rem", md: "3rem" }}
            fontSize={{ base: "3xl", md: "2xl" }}
            fontWeight="normal"
            color="white"
            onClick={onMetamaskConnect}
          >
            Connect
          </Button>
        )}
      </Navbar.UserProfile>
    </Navbar>
  );
}

export default Header;
