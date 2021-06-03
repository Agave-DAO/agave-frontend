import { Center, Circle, SquareProps } from "@chakra-ui/layout";
import { MouseEventHandler } from "react";

const ModalIcon: React.FC<{ onOpen: MouseEventHandler } & SquareProps> = ({
  onOpen,
  ...props
}) => {
  return (
    <Circle
      borderWidth={{ base: "1px", md: "2px" }}
      width={{ base: "1.2rem", md: "1.5rem" }}
      minHeight={{ base: "1.2rem", md: "1.5rem" }}
      boxSizing="content-box"
      as={Center}
      fontSize={{ base: ".85rem", md: "1rem" }}
      color="yellow.100"
      borderColor="yellow.100"
      position="absolute"
      top={{ base: "0.75rem", md: "1rem" }}
      right={{ base: "0.75rem", md: "1rem" }}
      cursor="pointer"
      onClick={onOpen}
      {...props}
    >
      ?
    </Circle>
  );
};

export default ModalIcon;
