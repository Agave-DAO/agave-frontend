import React from "react";
import { HamburgerIcon, ChevronLeftIcon } from "@chakra-ui/icons";
import { Flex, IconButton, useColorModeValue as mode } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { Brand } from "../NavComponents/brand";
import { AgaveBackground } from "./BackgroundImage";

interface MobileNavContentProps {
  isOpen?: boolean;
  onClose?: () => void;
  onOpen?: () => void;
}

export const MobileNavContent: React.FC<MobileNavContentProps> = props => {
  const { isOpen, onClose, onOpen } = props;
  const history = useHistory();

  return (
    <React.Fragment>
      <Flex flexDirection="column" justifyContent="center" alignItems="center">
        <AgaveBackground top="80px" />
        <Flex
          className="mobileNavBar"
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
            icon={<ChevronLeftIcon fontSize="35px" onClick={onClose} />}
            zIndex={3}
          />
          <Flex zIndex={3}>
            <Brand />
          </Flex>
          <IconButton
            display={{ base: "flex", md: "none" }}
            size="lg"
            aria-label="Open menu"
            fontSize="30px"
            w="40px"
            h="40px"
            variant="outline"
            onClick={isOpen ? onClose : onOpen}
            color="white"
            icon={<HamburgerIcon fontSize="28px" />}
            colorScheme="whiteAlpha"
            _activeLink={{ boxShadow: "black" }}
            zIndex={3}
          />
        </Flex>
      </Flex>
    </React.Fragment>
  );
};
