import {
  Flex,
  HStack,
  TabList,
  Tabs,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import React from "react";
import { UserProfile } from "./NavComponents/userprofile";
import { Links } from "./NavComponents/links";
import { Brand } from "./NavComponents/brand";
import { MobileNavOverlay } from "./mobile-nav";
import { AgaveBackground } from "./NavComponents/BackgroundImage";

const Header: React.FC<{}> = () => {
  return (
    <>
      <Flex display={{ base: "none", md: "block" }}>
        <Flex
          zIndex="1"
          className="NavBar"
          bg={mode("primary.900", "secondary.900")}
          boxShadow="none"
          justifyContent="space-between"
          alignItems="center"
          p="0px 30px"
          h="50px"
          top="0"
          wrap="wrap"
          position="static"
          borderBottomColor={"primary.50"}
          borderBottomWidth="1px"
          overflowY="hidden"
        >
          <Flex className="Brand" flex={{ base: "0", md: "1" }} zIndex={3}>
            <Brand />
          </Flex>
          <Tabs
            flex="3"
            variant="unstyled"
            className="Tabs"
            display={{ base: "none", md: "flex" }}
            h="100%"
            justifyContent="center"
            alignItems="center"
            zIndex={3}
          >
            <TabList className="TabList" display="flex" h="100%">
              <Links />
            </TabList>
          </Tabs>
          <HStack
            className="profile"
            flex="1"
            justify="flex-end"
            display={{ base: "none", md: "flex" }}
            spacing={3}
            zIndex={3}
          >
            <UserProfile />
          </HStack>
        </Flex>
        <AgaveBackground top="" />
      </Flex>
      <Flex display={{ base: "block", md: "none" }}>
        <MobileNavOverlay />
      </Flex>
    </>
  );
};

export default Header;
