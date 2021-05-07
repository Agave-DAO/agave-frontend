import { HamburgerIcon } from "@chakra-ui/icons";
import {
  Flex,
  HStack,
  IconButton,
  Spacer,
  Stack,
  TabList,
  Tabs,
  Divider,
  useColorModeValue as mode,
  useDisclosure,
} from "@chakra-ui/react";
import React, { isValidElement, ReactElement } from "react";
import { MobileNavContent } from "./mobile-nav";

export const Template: React.FC = props => {
  const children = React.Children.toArray(props.children).filter<ReactElement>(
    isValidElement
  );
  const mobileNav = useDisclosure();
  return (
    <Flex
      py={4}
      px={{ base: 4, md: 6, lg: 8 }}
      boxShadow="none"
      borderBottomWidth={mode("0", "1px")}
      bg={mode("primary.900", "secondary.900")}
      minH="4.8rem"
    >
      {children.find(child => child.type === Brand)?.props.children}
      <Spacer />
      <HStack display={{ base: "none", md: "flex" }} marginStart={4}>
        <Tabs colorScheme="blue" variant="unstyled" isFitted>
          <TabList>
            {children.find(child => child.type === Links)?.props.children}
          </TabList>
        </Tabs>
      </HStack>

      <HStack display={{ base: "none", md: "flex" }} spacing={3} ml="4rem">
        {children.find(child => child.type === UserProfile)?.props.children}
      </HStack>

      <IconButton
        display={{ base: "flex", md: "none" }}
        size="sm"
        aria-label="Open menu"
        fontSize="20px"
        variant="ghost"
        onClick={mobileNav.onOpen}
        color="white"
        icon={<HamburgerIcon />}
      />

      <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose}>
        <Stack spacing={5}>
          <Flex>
            {children.find(child => child.type === Brand)?.props.children}
          </Flex>
          <Tabs orientation="vertical" variant="unstyled">
            <TabList>
              {children.find(child => child.type === Links)?.props.children}
            </TabList>
          </Tabs>
          <Divider />

          <Flex>
            {children.find(child => child.type === UserProfile)?.props.children}
          </Flex>
        </Stack>
      </MobileNavContent>
    </Flex>
  );
};

const Brand: React.FC = () => null;
const Links: React.FC = () => null;
const UserProfile: React.FC = () => null;

export const Navbar = Object.assign(Template, { Brand, Links, UserProfile });
