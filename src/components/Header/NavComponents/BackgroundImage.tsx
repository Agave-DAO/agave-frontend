import React from "react";
import { Center, Image } from "@chakra-ui/react";
import glowingAgave from "../../../assets/image/glowing-agave.svg";

interface AgaveBackgroundProps {
  top?: string;
}
export const AgaveBackground: React.FC<AgaveBackgroundProps> = props => {
  return (
    <Center
      pos="relative"
      mt={{ base: "-80px", md: "-50px" }}
      width="100%"
      overflowY="hidden"
      overflowX="hidden"
      h={{ base: "80px", md: "50px" }}
      maxH={{ base: "80px", md: "50px" }}
      zIndex="0"
      top={props.top}
    >
      <Image
        pos="absolute"
        src={glowingAgave}
        alt="glowing agave log"
        top={{ base: "-5rem", md: "-15rem", lg: "-25rem" }}
        left="0"
      />
    </Center>
  );
};
