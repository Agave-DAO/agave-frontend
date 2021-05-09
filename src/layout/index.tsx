import React from "react";
import glowingAgave from "../assets/image/glowing-agave.svg";
import Header from "../components/Header";
import UnlockWallet from "../components/UnlockWallet";
import { Box, Center, HStack, Image, Text } from "@chakra-ui/react";
import { useAmbientConnection } from "../hooks/injectedConnectors";

export const Layout: React.FC<{ header: React.ReactNode }> = ({
  header,
  children,
}) => {
  const { active: activeConnection } = useAmbientConnection();

  const headerMemo = React.useMemo(
    () =>
      !activeConnection ? (
        <Text textAlign="left" w="90%" color="white">
          Please connect your wallet
        </Text>
      ) : (
        header
      ),
    [activeConnection, header]
  );

  const childrenMemo = React.useMemo(
    () =>
      !activeConnection ? (
        <HStack
          spacing={{ base: "2.4rem", md: "1.6rem" }}
          height={{ base: "100%" }}
        >
          <UnlockWallet />
        </HStack>
      ) : (
        children
      ),
    [activeConnection, children]
  );

  return (
    <Box
      position="relative"
      bg="secondary.900"
      minH="100vh"
      maxH="100%"
      overflow={{ base: "visible", md: "hidden" }}
      pb={{ base: "5rem", md: "0" }}
    >
      <Header />
      <Box
        minH="11.1rem"
        bg="primary.500"
        position="relative"
        zIndex="2"
        display={{ base: "none", md: "block" }}
      />
      <Box
        position={{ base: "relative", md: "absolute" }}
        zIndex="2"
        top={{ md: "9.4rem" }}
        left="50%"
        transform="translateX(-50%)"
        // lg, md, sm
        minW={{ base: "70vw", md: "80vw", lg: "90vw" }}
      >
        <Center
          rounded={{ md: "lg" }}
          minH={{ base: "6.6rem", md: "9.6rem" }}
          mb={{ base: "2.6rem", md: "3.5rem" }}
          bg={{ base: "primary.500", md: "primary.900" }}
        >
          {headerMemo}
        </Center>
        {childrenMemo}
      </Box>
      <Center mt="20rem" display={{ base: "none", md: "block" }}>
        <Image src={glowingAgave} boxSize="145rem" alt="glowing agave log" />
      </Center>
    </Box>
  );
};
