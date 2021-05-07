import React, { ReactElement, isValidElement } from "react";
import glowingAgave from "../assets/image/glowing-agave.svg";
import Header from "../components/Header";
import UnlockWallet from "../components/UnlockWallet";
import { Box, Center, HStack, Image, Text } from "@chakra-ui/react";
import { useAmbientConnection } from "../hooks/injectedConnectors";

const Index: React.FC = props => {
  const children = React.Children.toArray(props.children).filter<ReactElement>(
    isValidElement
  );

  const { active: activeConnection } = useAmbientConnection();

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
        w="70vw"
      >
        <Center rounded="lg" minH="9.6rem" mb="3.5rem" bg="primary.900">
          {!activeConnection ? (
            <Text textAlign="left" w="90%" color="white">
              Please connect your wallet
            </Text>
          ) : (
            children.find(child => child.type === Banner)?.props.children || (
              <Text textAlign="left" w="90%" color="white">
                Welcome
              </Text>
            )
          )}
        </Center>

        {!activeConnection ? (
          <HStack spacing="1.6rem">
            <UnlockWallet />
            {children.find(child => child.type === StakingBody)?.props.children}
          </HStack>
        ) : (
          children.find(child => child.type === Body)?.props.children
        )}
      </Box>
      <Center mt="20rem">
        <Image src={glowingAgave} boxSize="145rem" alt="glowing agave log" />
      </Center>
    </Box>
  );
};

const Banner: React.FC = () => null;
const Body: React.FC = () => null;
const StakingBody: React.FC = () => null;

export default Object.assign(Index, { Banner });
