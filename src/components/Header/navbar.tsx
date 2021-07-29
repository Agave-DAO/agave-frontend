import { HamburgerIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import glowingAgave from "../../assets/image/glowing-agave.svg";
import {
  Center,
  Image,
  Flex,
  HStack,
  IconButton,
  TabList,
  Tabs,
  Divider,
  useColorModeValue as mode,
  useDisclosure,
} from "@chakra-ui/react";
import React, {
  isValidElement,
  ReactElement,
  useState,
  useEffect,
  useRef,
} from "react";
import { MobileNavContent } from "./mobile-nav";
import { useHistory } from "react-router-dom";

export const Template: React.FC = props => {
  const children = React.Children.toArray(props.children).filter<ReactElement>(
    isValidElement
  );
  const mobileNav = useDisclosure();
  const history = useHistory();
  const [boxWidth, setBoxWidth] = useState(0);

  useEffect(() => {
    const w = document.getElementsByClassName("profile");
    setBoxWidth(w[0].clientWidth ? w[0].clientWidth - 110 : 0);
  }, [boxWidth]);

  return (
    <React.Fragment>
      <Flex
        zIndex="1"
        className="NavBar"
        bg={mode("primary.900", "secondary.900")}
        boxShadow="none"
        justifyContent="space-between"
        alignItems="center"
        p="0px 30px"
        h={{ base: "80px", md: "50px" }}
        top="0"
        wrap="wrap"
        position="static"
        borderBottomColor={"primary.50"}
        borderBottomWidth="1px"
        overflowY="hidden"
      >
        <IconButton
          display={{ base: "inherit", md: "none" }}
          size="lg"
          w="40px"
          h="40px"
          fontSize="30px"
          aria-label="Back"
          variant="outline"
          onClick={() => history.goBack()}
          colorScheme="whiteAlpha"
          color="white"
          icon={<ChevronLeftIcon fontSize="35px" onClick={mobileNav.onClose} />}
          zIndex={3}
        />
        <Flex zIndex={3}>
          {children.find(child => child.type === Brand)?.props.children}
        </Flex>

        {/* Add spacer to off center tabs to the right */}
        {/* <Spacer /> */}
        <Tabs
          variant="unstyled"
          className="Tabs"
          display={{ base: "none", md: "flex" }}
          h="100%"
          ml={{ base: "0", md: "1", lg: boxWidth }}
          justifyContent="center"
          alignItems="center"
          zIndex={3}
        >
          <TabList className="TabList" display="flex" h="100%" flex="1 1 auto">
            {children.find(child => child.type === Links)?.props.children}
          </TabList>
        </Tabs>

        <HStack
          className="profile"
          display={{ base: "none", md: "flex" }}
          spacing={3}
          zIndex={3}
        >
          {children.find(child => child.type === UserProfile)?.props.children}
        </HStack>

        <IconButton
          display={{ base: "flex", md: "none" }}
          size="lg"
          aria-label="Open menu"
          fontSize="30px"
          w="40px"
          h="40px"
          variant="outline"
          onClick={mobileNav.isOpen ? mobileNav.onClose : mobileNav.onOpen}
          color="white"
          icon={<HamburgerIcon fontSize="28px" />}
          colorScheme="whiteAlpha"
          _activeLink={{ boxShadow: "black" }}
          zIndex={3}
        />

        <MobileNavContent isOpen={mobileNav.isOpen} onClose={mobileNav.onClose}>
          <Flex
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Center
              pos="relative"
              mt={{ base: "-80px", md: "-50px" }}
              width="100%"
              overflowY="hidden"
              overflowX="hidden"
              h={{ base: "80px", md: "50px" }}
              maxH={{ base: "80px", md: "50px" }}
              zIndex="0"
              top="80px"
            >
              <Image
                pos="absolute"
                src={glowingAgave}
                alt="glowing agave log"
                top={{ base: "-5rem", md: "-15rem", lg: "-25rem" }}
                left="0"
              />
            </Center>
            <Flex
              className="NavBar2"
              bg={mode("primary.900", "secondary.900")}
              boxShadow="none"
              justifyContent="space-between"
              alignItems="center"
              p="0px 30px"
              h={{ base: "80px", md: "50px" }}
              top="0"
              w="100%"
              position="static"
              borderBottomColor={"primary.50"}
              borderBottomWidth="1px"
              overflowY="hidden"
            >
              <IconButton
                display={{ base: "inherit", md: "none" }}
                size="lg"
                w="40px"
                h="40px"
                fontSize="30px"
                aria-label="Back"
                variant="outline"
                onClick={() => history.goBack()}
                colorScheme="whiteAlpha"
                color="white"
                icon={
                  <ChevronLeftIcon
                    fontSize="35px"
                    onClick={mobileNav.onClose}
                  />
                }
                zIndex={3}
              />
              <Flex zIndex={3}>
                {children.find(child => child.type === Brand)?.props.children}
              </Flex>
              <IconButton
                display={{ base: "flex", md: "none" }}
                size="lg"
                aria-label="Open menu"
                fontSize="30px"
                w="40px"
                h="40px"
                // mr="11"
                variant="outline"
                onClick={
                  mobileNav.isOpen ? mobileNav.onClose : mobileNav.onOpen
                }
                color="white"
                icon={<HamburgerIcon fontSize="28px" />}
                colorScheme="whiteAlpha"
                _activeLink={{ boxShadow: "black" }}
                zIndex={3}
              />
            </Flex>
            <Flex
              h="10rem"
              w="100%"
              justifyContent="center"
              alignItems="center"
            >
              {
                children.find(child => child.type === UserProfile)?.props
                  .children
              }
            </Flex>
            <Divider />
            <Flex>
              <Tabs orientation="vertical" variant="unstyled">
                <TabList onClick={mobileNav.onClose} h="100%" w="100%">
                  {children.find(child => child.type === Links)?.props.children}
                </TabList>
              </Tabs>
            </Flex>
          </Flex>
        </MobileNavContent>
      </Flex>
      <Center
        pos="relative"
        mt={{ base: "-80px", md: "-50px" }}
        width="100%"
        overflowY="hidden"
        overflowX="hidden"
        h={{ base: "80px", md: "50px" }}
        maxH={{ base: "80px", md: "50px" }}
        zIndex="0"
      >
        <Image
          pos="absolute"
          src={glowingAgave}
          alt="glowing agave log"
          top={{ base: "-5rem", md: "-15rem", lg: "-25rem" }}
          left="0"
        />
      </Center>
    </React.Fragment>
  );
};

const Brand: React.FC = () => null;
const Links: React.FC = () => null;
const UserProfile: React.FC = () => null;

export const Navbar = Object.assign(Template, {
  Brand,
  Links,
  UserProfile,
});
