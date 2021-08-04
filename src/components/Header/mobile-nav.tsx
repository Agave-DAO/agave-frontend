import React from "react";
import {
  Flex,
  TabList,
  Tabs,
  Divider,
  useDisclosure,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Links } from "./NavComponents/links";
import { UserProfile } from "./NavComponents/userprofile";
import { MobileNavBar } from "./NavComponents/mobile-nav-bar";

export const MobileNavOverlay: React.FC<{}> = () => {
  const mobileNav = useDisclosure();
  const lightGrad =
    "radial-gradient(circle, rgba(79,203,141,1) 5%, rgba(0,124,110,1) 100%)";
  const darkGrad =
    "radial-gradient(circle, rgba(24,79,60,1) 0%, rgba(17,120,101,1) 61%, rgba(0,124,110,1) 100%)";
  const bg = mode(lightGrad, darkGrad);

  return (
    <React.Fragment>
      <MobileNavBar
        isOpen={mobileNav.isOpen}
        onClose={mobileNav.onClose}
        onOpen={mobileNav.onOpen}
      />
      {/* MOBILE OVERLAY STARTS BELOW  */}
      <AnimatePresence>
        {mobileNav.isOpen && (
          <motion.div
            transition={{ duration: 0.15 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              height: "0",
              width: "0",
              top: 0,
              left: 0,
              zIndex: 20,
            }}
          >
            <Flex
              className="mobileover"
              direction="column"
              bg={bg}
              w="100vw"
              h="100%"
              minH="100vh"
              pos="absolute"
              left={0}
              zIndex={20}
              overflowY="auto"
              // top="80px"
            >
              <MobileNavBar
                isOpen={mobileNav.isOpen}
                onClose={mobileNav.onClose}
                onOpen={mobileNav.onOpen}
              />
              <Flex
                h="10rem"
                w="100%"
                justifyContent="center"
                alignItems="center"
              >
                <UserProfile />
              </Flex>
              <Divider />
              <Flex>
                <Tabs orientation="vertical" variant="unstyled">
                  <TabList onClick={mobileNav.onClose} h="100%" w="100%">
                    <Links />
                  </TabList>
                </Tabs>
              </Flex>
            </Flex>
          </motion.div>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
};
