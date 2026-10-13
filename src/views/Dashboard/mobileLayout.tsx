import React from "react";
import { Center, Text, Button, VStack, Box, Flex } from "@chakra-ui/react";

export const MobileDashboardLayout: React.FC<{}> = () => {
  return (
    <Flex
      align="center"
      flexBasis="auto"
      gap="1em"
      w="100%"
      flexDirection={{ base: "column", lg: "row" }}
      m="auto"
    ></Flex>
  );
};
