import React from "react";
import { Link, Tab, useColorModeValue as mode } from "@chakra-ui/react";
import { NavLink } from "react-router-dom";

// Chakra slows typechecking massively; setting this to `any` saves us ~2 seconds on every typecheck
// export const NavTabLink: React.FC<LinkProps & NavLinkProps<unknown>> = props => {
export const NavTabLink: React.FC<any> = props => {
  return (
    <Tab
      className="Tab"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      w={{ base: "100vw", md: "100%" }}
      pt="2"
      pb="0"
      ml={{ base: "0", md: "1rem" }}
      flex="1 1 auto"
      borderBottomWidth={{ base: "thin", md: "inherit" }}
      _selected={{ color: mode("grey.500", "white") }}
      _focus={{ shadow: "none" }}
    >
      <Link
        order={1}
        className="Link"
        as={NavLink}
        display="flex"
        fontWeight="100"
        lineHeight={{ base: "3rem", md: "1.25rem" }}
        fontSize={{ base: "6xl", md: "2xl" }}
        p={{ base: "2rem", md: "0" }}
        color="white"
        alignItems="center"
        h="100%"
        borderBottomColor="rgba(0,0,0,0)"
        borderBottomWidth="3px"
        transition="none"
        zIndex={3}
        _hover={{
          color: mode("white", "grey.500"),
          cursor: "pointer",
          borderBottomColor: "primary.100",
        }}
        _activeLink={{
          color: mode("white", "grey.500"),
          fontWeight: "700",
          borderBottomColor: "primary.100",
        }}
        _focus={{ shadow: "none" }}
        {...props}
      />
    </Tab>
  );
};
