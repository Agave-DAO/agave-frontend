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

  const [isFullRes] = useMediaQuery("(max-width: 1923px)");
  const [isLargeTab] = useMediaQuery("(max-width: 1200px)");
  const [isSmallTab] = useMediaQuery("(max-width: 800px)");
  const [isLargePhone] = useMediaQuery("(max-width: 600px)");
  const [isMobile] = useMediaQuery("(max-width: 450px)");

  return (
    <Box
      className={"MasterLayoutContainer"}
      position="relative"
      bg="secondary.900"
      // minH={{ base: "100vh", md: "100%" }}
      // maxH={{ base: "100%", md: "100vh" }}
      // overflow={{ base: "visible", md: "hidden" }}
      minH="100vh" // Allows background to stretch screen if not enough content to fill viewport
      maxH="100vh" // Allows background to stretch screen if exess content fills viewport
      overflowY="auto" // Allows content to stretch screen vertically
      overflowX="hidden" // Prevents content from bleeding horizontally on small screens
      // For this to be mobile-friendly, top-level components views should use a chakra container or box with minW to keep content from bleeding out of small screen views and allowing the content to break at specified global mobile theme definitions. https://chakra-ui.com/docs/layout/container
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
        className={"DetailsContainer"}
        position={{ base: "relative", md: "absolute" }}
        zIndex="2"
        top={{ md: "9.4rem" }}
        left="50%"
        transform="translateX(-50%)"
        // lg, md, sm
        minW={{ base: "70vw", md: "80vw", lg: "90vw" }}
      >
        <Center
          className={"headerMemoBox"}
          rounded={{ md: "lg" }}
          minH={{ base: "6.6rem", md: "9.6rem" }}
          mb={{ md: "3.5rem" }}
          bg={{ base: "primary.500", md: "primary.900" }}
          fg={{ base: "primary.100", md: "primary.100" }}
          color={{ base: "primary.100", md: "primary.100" }}
          px={{ base: "2.3rem", md: "4.7rem" }}
        >
          {headerMemo}
        </Center>
        <Box
          className={"ChildrenContainer"}
          minH={isFullRes ? "79vh" : "100vh"}
          // minH={{ base: "100%", lg: "70vh", xl: "100vh" }}
        >
          {childrenMemo}
          <Center>
            <Box
              // Image Container must be adjacent to children to push image below on overflow
              className={"FlowerImgContainer"}
              zIndex="-1"
              display="block"
              bg="secondary.900"
              position="absolute"
              overflowY="hidden"
              bottom="0px"
            >
              <Center
                m="0rem"
                display={{ base: "none", md: "flex" }}
                overflowY="hidden"
                maxH="50rem"
                alignItems="end"
                position="relative"
              >
                <Image
                  src={glowingAgave}
                  boxSize="145rem"
                  alt="glowing agave log"
                />
              </Center>{" "}
            </Box>
          </Center>
        </Box>
      </Box>
    </Box>
  );
};
