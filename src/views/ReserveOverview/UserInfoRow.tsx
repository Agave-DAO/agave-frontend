import React, { useState } from "react";
import { Text, Flex } from "@chakra-ui/react";

// TODO real types
interface Props {
  title: string;
  value: any;
  type?: string;
}

const UserInfoRow: React.FC<Props> = ({ ...props }) => {
  // Default Component States
  const [title] = useState(props.title ? props.title : "");
  const [value] = useState(props.value ? props.value : "~");
  const [type] = useState(props.type ? props.type : "");

  return (
    <React.Fragment>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        mb="15px"
      >
        <Flex>
          <Text fontSize="2xl">{title}</Text>
        </Flex>
        <Flex>
          <Text fontSize="2xl">
            {value} {type}
          </Text>
        </Flex>
      </Flex>
    </React.Fragment>
  );
};

export default UserInfoRow;
