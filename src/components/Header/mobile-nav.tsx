import React from "react";
import { Flex, useColorModeValue } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  isOpen?: boolean;
  onClose?: () => void;
}

export const MobileNavContent: React.FC<Props> = props => {
  const { isOpen, children } = props;

  const lightGrad =
    "radial-gradient(circle, rgba(79,203,141,1) 5%, rgba(0,124,110,1) 100%)";
  const darkGrad =
    "radial-gradient(circle, rgba(24,79,60,1) 0%, rgba(17,120,101,1) 61%, rgba(0,124,110,1) 100%)";
  const bg = useColorModeValue(lightGrad, darkGrad);

  return (
    <AnimatePresence>
      {isOpen && (
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
            // TODO top={{ base: "80px", md: "50px" }}
            left={0}
            zIndex={20}
            overflowY="auto"
          >
            {children}
            {/* <CloseButton
              pos="absolute"
              top={12}
              right={12}
              onClick={onClose}
              colorScheme="whiteAlpha"
            /> */}
          </Flex>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
