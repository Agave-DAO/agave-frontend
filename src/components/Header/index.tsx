import { useMemo } from "react";
import { Box, Text, Center, useColorModeValue } from "@chakra-ui/react";
import { Navbar } from "./navbar";
import { ReactComponent as Logo } from "../../assets/image/logo.svg";
import { selectAddress } from "../../features/auth/authSlice";
import { useAppSelector } from "../../redux/hooks";
import { NavLink } from "react-router-dom";

function Header() {
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
    <Box minH="4.8rem" bg={useColorModeValue("primary.900", "primary.900")}>
      <Navbar>
        <Navbar.Brand>
          <Center as={NavLink} to="/">
            <Logo />
            <Text color="white" fontWeight="medium" ml={4}>
              Agaave
            </Text>
          </Center>
        </Navbar.Brand>
      </Navbar>
    </Box>
  );
}

export default Header;
