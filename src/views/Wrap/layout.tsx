import React from "react";
import { Box, Center, Text, Flex, VStack, StackDivider, Spinner } from "@chakra-ui/react";
import { CenterProps, HStack } from "@chakra-ui/layout";
import { isMobileOnly, isMobile } from "react-device-detect";

export const WrapBanner: React.FC<{}> = () => {
    return (
        <Box w="100%">
        {!isMobileOnly && (
          <Center width="100%" justifyContent="space-between">
            <Text
              fontWeight="bold"
              color="white"
              fontSize={{ base: "1.8rem", md: "2.4rem" }}
            >
              Wrapped tokens
            </Text>
          </Center>
        )}
      </Box>
    );
}

export const WrapLayout: React.FC<{}> = () => {
    return (
        <Flex flexDirection="column">
        <Flex
          align="center"
          flexBasis="auto"
          spacing="1em"
          w="100%"
          flexDirection={{ base: "column", lg: "row" }}
          m="auto"
          color="white"
        >
          <UpperBox
            title="Column 1"
            textAlign="center"
            mr={{ base: "inherit", lg: "2%" }}
          >
            <VStack flexDirection="column" h="7.5rem" alignItems="baseline">
              <HStack d="flex" mt="0.5rem">
                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</Text>
              </HStack>
            </VStack>
          </UpperBox>
          <UpperBox
            title="Column 2"
            textAlign="center"
            mt={{ base: "2rem", lg: "inherit" }}
          >
            <Box
              d="flex"
              flexDirection="row"
              textAlign="center"
              justifyContent="space-between"
              whiteSpace="nowrap"
              h="7.5rem"
            >
              <VStack
                flexDirection="column"
                h="7rem"
                alignItems="center"
              >
                <HStack d="flex" mt="0.5rem">
                    <Text>{isMobile ? "#1" : "Value 1"}</Text>
                </HStack>
                <Text fontWeight="bold" textAlign="center" mt="0.5em">
                    -
                </Text>
              </VStack>
              <VStack
                flexDirection="column"
                h="7rem"
                alignItems="center"
                ml={{ base: "0.5rem", md: "1.5rem" }}
                mr={{ base: "0.5rem", md: "1.5rem" }}
                >
                <HStack d="flex" mt="0.5rem">
                    <Text>{isMobile ? "#2" : "Value 2"}</Text>
                </HStack>
                <Text fontWeight="bold" textAlign="center" mt="0.5em">
                    <Spinner
                      speed="0.5s"
                      emptyColor="gray.200"
                      color="yellow.500"
                    />
                </Text>
              </VStack>
              <VStack
                flexDirection="column"
                h="7rem"
                alignItems="center"
                ml={{ base: "0.5rem", md: "1.5rem" }}
                mr={{ base: "0.5rem", md: "1.5rem" }}
              >
                <HStack d="flex" mt="0.5rem">
                    <Text>{isMobile ? "#3" : "Value 3"}</Text>
                </HStack>
                <Text fontWeight="bold" textAlign="center" mt="0.5em">
                  0
                </Text>
              </VStack>
              <VStack
                flexDirection="column"
                h="7rem"
                alignItems="center"
              >
                <HStack d="flex" mt="0.5rem">
                    <Text>{isMobile ? "#4" : "Value 4"}</Text>
                </HStack>
                <Text fontWeight="bold" textAlign="left" mt="0.5em">
                  Yes
                </Text>
              </VStack>
            </Box>
          </UpperBox>
        </Flex>
      </Flex>
    );
}



const UpperBox: React.FC<{ title: string } & CenterProps> = ({
    title,
    children,
    ...props
  }) => {
    return (
      <Center
        boxSizing="content-box"
        flexDirection="column"
        rounded="xl"
        minH="10.6rem"
        minW={{ base: "100%", lg: "auto" }}
        flex={1}
        bg="primary.900"
        py="1rem"
        {...props}
      >
        <VStack
          divider={
            <StackDivider
              borderColor="#36CFA2"
              h="0.188rem"
              backgroundColor="#36CFA2"
            />
          }
          spacing={4}
          w="100%"
          align="stretch"
          flexDirection="column"
        >
          <Text px={{ base: "2rem", md: "3rem" }} h="25">
            {title}
          </Text>
          <Box px={{ base: "2rem", md: "3rem" }}>{children}</Box>
        </VStack>
      </Center>
    );
  };