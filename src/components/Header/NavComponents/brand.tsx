import React from "react";
import { Text, Image, Center } from "@chakra-ui/react";
import agaveLogo from "../../../assets/image/agave-logo.svg";
import { NavLink } from "react-router-dom";

export const Brand: React.FC<{}> = () => {
  return (
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
  );
};
