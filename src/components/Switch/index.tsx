import React from "react";
import { Button, ButtonGroup } from "@chakra-ui/react";

export function Switch<T>({
  values,
  activeValue,
  setActiveValue,
}: {
  values: [T, T];
  activeValue: T;
  setActiveValue: (active: T) => void;
}) {
  return (
    <ButtonGroup size="lg" isAttached variant="solid" rounded="none">
      <Button
        mr="-px"
        backgroundColor={
          activeValue === values[0] ? "secondary.900" : "primary.500"
        }
        _hover={{ bg: "primary.50" }}
        _focus={{
          borderColor: "secondary.900",
        }}
        onClick={() => setActiveValue(values[0])}
      >
        {values[0]}
      </Button>
      <Button
        mr="-px"
        backgroundColor={
          activeValue === values[1] ? "secondary.900" : "primary.500"
        }
        _hover={{ bg: "primary.50" }}
        _focus={{
          borderColor: "secondary.900",
        }}
        onClick={() => setActiveValue(values[1])}
      >
        {values[1]}
      </Button>
    </ButtonGroup>
  );
}

export default Switch;
