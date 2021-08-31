import React from "react";
import ColoredText from "../../components/ColoredText";
import { Flex } from "@chakra-ui/react";
import { Text } from "@chakra-ui/layout";
import { withRouter } from "react-router-dom";

const ReserveBanner: React.FC<{}> = (props: any) => {
  const title = "Reserve Details";

  return (
    <Flex
      flexDir="row"
      justifyItems="stretch"
      height="auto"
      marginRight="auto"
      fontWeight="bold"
    >
      <Text fontSize="4xl" mx="1rem">
        {" "}
        {title}
      </Text>
      <ColoredText fontSize="4xl" textTransform="capitalize">
        {props.match.params.assetName ?? "-"}
      </ColoredText>
      {/*}
      <Text align="left" fontSize="3xl">
        {`${message}`}
      </Text>
      */}
    </Flex>
  );
};

export default withRouter(ReserveBanner);
