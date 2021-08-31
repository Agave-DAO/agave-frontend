import React from "react";
import { Text, Flex } from "@chakra-ui/react";
import { ModalIcon } from "../../utils/icons";

interface Props {
  title: string;
  value: any;
  type?: string;
  enableModal?: boolean;
  modalOpen?: any;
}

const UserInfoRow: React.FC<Props> = ({ ...props }) => {
  // Default Component States
  const title = props.title ? props.title : "";
  const value = props.value ? props.value : "~";
  const type = props.type ? props.type : "";

  return (
    <React.Fragment>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        flexDirection="row"
        lineHeight="3.5rem"
      >
        <Flex justifyContent="center" alignItems="center">
          <Text fontSize="2xl">{title}</Text>
          {props.enableModal && (
            <ModalIcon
              position="relative"
              top="0"
              left="2"
              maxHeight="1.2rem"
              onOpen={() => props.modalOpen(props.title)}
            />
          )}
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
