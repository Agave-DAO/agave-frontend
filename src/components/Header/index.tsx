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
        >
          <img src={isDarkMode ? darkMoon : lightMoon} alt="theme-mode" />
        </Center>
        <Center
          minWidth="10rem"
          height="3rem"
          fontSize="1.4rem"
          mx="1.5rem"
          textTransform="uppercase"
          color="white"
          bg="primary.500"
          rounded="lg"
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
            <Text fontSize="1.4rem">{addressPretty}</Text>
          </Center>
        ) : (
          <Button
            background="primary.500"
            rounded="lg"
            minWidth="10rem"
            height="3rem"
            fontSize="1.4rem"
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
