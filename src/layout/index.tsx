import React from "react";
import glowingAgave from "../assets/image/glowing-agave.svg";
import Header from "../components/Header";
import UnlockWallet from "../components/UnlockWallet";
import {
  Box,
  Center,
  HStack,
  Image,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useAppWeb3 } from "../hooks/appWeb3";
export const Layout: React.FC<{ header: React.ReactNode }> = ({
  header,
  children,
}) => {
  const { active: activeConnection } = useAppWeb3();
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
    <Box position="relative" bg="secondary.900">
      <Header />
      <Box
        minH="11.1rem"
        bg="primary.500"
        position="relative"
        zIndex="2"
        display={{ base: "none", lg: "block" }}
      />
      <Box
        position={{ base: "relative", md: "absolute" }}
        zIndex="2"
        top={{ md: "9.4rem" }}
        pb="4rem"
        left="50%"
        transform="translateX(-50%)"
        // lg, md, sm
        minW={{ base: "90vw", xl: "85vw" }}
      >
        <Center
          rounded={{ md: "lg" }}
          minH={{ base: "6.6rem", lg: "9.6rem" }}
          mb={{ md: "3.5rem" }}
          bg={{ base: "primary.500", md: "primary.900" }}
          fg={{ base: "primary.100", md: "primary.100" }}
          color={{ base: "primary.100", md: "primary.100" }}
          px={{ base: "2.3rem", md: "4.7rem" }}
        >
          {headerMemo}
        </Center>
        {childrenMemo}
      </Box>
      <Center
        pos="absolute"
        bottom="0"
        width="100%"
        display={{ base: "none", md: "flex" }}
      >
        <Image
          w={{ base: "0vw", lg: "90vw", xl: "80vw" }}
          pos="fixed"
          bottom="-10em"
          src={glowingAgave}
          alt="glowing agave log"
        />
      </Center>
    </Box>
  );
};
