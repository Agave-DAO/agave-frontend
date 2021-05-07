import React from "react";
import {
  Link,
  LinkProps,
  Tab,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { NavLink, NavLinkProps } from "react-router-dom";

export const NavTabLink: React.FC<LinkProps & NavLinkProps> = props => {
  return (
    <Tab
      _selected={{ color: mode("grey.500", "white") }}
      _focus={{ shadow: "none" }}
      justifyContent="flex-start"
      px={{ base: 4, md: 6 }}
    >
      <Link
        as={NavLink}
        display="block"
        fontWeight="medium"
        lineHeight="1.25rem"
        color="inherit"
        _hover={{ color: mode("white", "grey.500") }}
        _activeLink={{
          color: mode("white", "grey.500"),
        }}
        {...props}
      />
    </Tab>
  );
};
