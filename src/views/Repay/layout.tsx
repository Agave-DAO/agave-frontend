import React from "react";
import {
  Center,
  Link,
  Text,
  useMediaQuery
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

export interface RepayBannerProps {}

export const RepayBanner: React.FC<{}> = () => {
  const history = useHistory();
  const [isSmallerThan900] = useMediaQuery("(max-width: 900px)");
  return (
    <Center width="100%" justifyContent="space-between">
      <Text
        fontWeight="bold"
        color="white"
        fontSize={{ base: "1.8rem", md: "2.4rem" }}
        onClick={() => history.push("/repay")}
      >
        Repay
      </Text>
	  {isSmallerThan900 ? null :
      <Text>
        Need your Polygon (Matic) or BSC assets on xDai? Please visit{" "}
        <Link fontWeight="bold">xpollinate.io</Link>
      </Text>
		}
    </Center>
  );
};

