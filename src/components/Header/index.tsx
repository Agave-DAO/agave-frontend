import { useMemo, useState } from "react";
import { Text, Center, Button, Badge } from "@chakra-ui/react";
import { Navbar } from "./navbar";
import agaveLogo from "../../assets/image/agave-logo.svg";
import darkMoon from "../../assets/image/dark-moon.svg";
import lightMoon from "../../assets/image/light-moon.svg";
import { selectAddress } from "../../features/auth/authSlice";
import { useAppSelector } from "../../redux/hooks";
import { NavLink } from "react-router-dom";
import { NavTabLink } from "./tab-link";
import { fontSizes } from "../../utils/constants";

function Header() {
  // eslint-disable-next-line
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
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

  return (
    <Navbar>
      <Navbar.Brand>
        <Center as={NavLink} to="/" marginEnd={6}>
          <img src={agaveLogo} alt="AGAVE ALT" />
          <Text color="white" ml={4} fontWeight="bold">
            AGAVE
          </Text>
        </Center>
      </Navbar.Brand>
      <Navbar.Links>
        <NavTabLink w="14rem" exact to="/dashboard" fontWeight="bold">
          DASHBOARD
        </NavTabLink>
        <NavTabLink exact to="/markets" fontWeight="bold">
          MARKETS
        </NavTabLink>
        <NavTabLink exact to="/borrow" fontWeight="bold">
          BORROW
        </NavTabLink>
        <NavTabLink exact to="/deposit" fontWeight="bold">
          DEPOSIT
        </NavTabLink>
        <NavTabLink exact to="/stake" fontWeight="bold">
          STAKE
        </NavTabLink>
      </Navbar.Links>
      <Navbar.UserProfile>
        <Center
          width="3rem"
          height="3rem"
          rounded="lg"
          bg="primary.500"
          cursor="pointer"
          display="none"
        >
          <img src={isDarkMode ? darkMoon : lightMoon} alt="theme-mode" />
        </Center>
        <Center
          minWidth="10rem"
          height="3rem"
          fontSize={fontSizes.md}
          mx="1.5rem"
          textTransform="uppercase"
          color="white"
          bg="primary.500"
          rounded="lg"
          display="none"
        >
          0 AGVE
        </Center>
        {addressPretty ? (
          <Center
            background="primary.500"
            rounded="lg"
            minWidth="10rem"
            height="3rem"
            color="white"
          >
            <Badge
              bg="yellow"
              rounded="full"
              width="1rem"
              height="1rem"
              mr="5px"
            />
            <Text fontSize={fontSizes.md}>{addressPretty}</Text>
          </Center>
        ) : (
          <Button
            background="primary.500"
            rounded="lg"
            minWidth="10rem"
            height="3rem"
            fontSize={fontSizes.md}
            fontWeight="normal"
            color="white"
          >
            Connect
          </Button>
        )}
      </Navbar.UserProfile>
    </Navbar>
  );
}

export default Header;
