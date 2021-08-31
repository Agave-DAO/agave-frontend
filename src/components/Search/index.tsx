import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  InputGroupProps,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

export const Search: React.FC<InputGroupProps> = ({
  placeholder,
  ...props
}) => {
  return (
    <InputGroup {...props}>
      <Input
        h={props.h}
        placeholder={placeholder}
        focusBorderColor="primary.100"
      />
      <InputRightElement h="100%" mr={1} children={<SearchIcon />} />
    </InputGroup>
  );
};
