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
        <HStack spacing="1.6rem">
          <UnlockWallet />
        </HStack>
      ) : (
        children
      ),
    [activeConnection, children]
  );

  return (
    <Box position="relative" bg="secondary.900" h="100vh" overflow="hidden">
      <Header />
      <Box minH="11.1rem" bg="primary.500" position="relative" zIndex="2" />
      <Box
        position="absolute"
        zIndex="2"
        top="9.4rem"
        left="50%"
        transform="translateX(-50%)"
        // lg, md, sm
        minW={["70vw", "80vw", "90vw"]}
      >
        <Center rounded="lg" minH="9.6rem" mb="3.5rem" bg="primary.900">
          {headerMemo}
        </Center>

        {childrenMemo}
      </Box>
      <Center mt="20rem">
        <Image src={glowingAgave} boxSize="145rem" alt="glowing agave log" />
      </Center>
    </Box>
  );
};
