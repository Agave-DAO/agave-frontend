import React from "react";
import {
  Box,
  Center,
  Flex,
  Link,
  StackDivider,
  Text,
  VStack,
  useMediaQuery,
} from "@chakra-ui/react";
// import Switch from '../../components/Switch'
// import Search from '../../components/Search'
import { BorrowTable } from "./BorrowTable";
import { BorrowAsset } from ".";
import { MyBorrowsTable } from "./MyBorrows";
import { useHistory } from "react-router-dom";

export interface BorrowBannerProps {}

export interface BorrowLayoutProps {
  activeValue: string;
  setActiveValue: (active: any) => void;
  borrowedList: BorrowAsset[] | undefined;
}

export const BorrowBanner: React.FC<{}> = () => {
  const history = useHistory();
  const [isSmallerThan900] = useMediaQuery("(max-width: 900px)");
  return (
    <Center width="100%" justifyContent="space-between">
      <Text
        fontWeight="bold"
        color="white"
        fontSize={{ base: "1.8rem", md: "2.4rem" }}
        onClick={() => history.push("/borrow")}
      >
        Borrow
      </Text>
      {isSmallerThan900 ? null : (
        <Text>
          Need your Polygon (Matic) or BSC assets on xDai? Please visit{" "}
          <Link fontWeight="bold">xpollinate.io</Link>
        </Text>
      )}
    </Center>
  );
};

export const BorrowLayout: React.FC<BorrowLayoutProps> = props => {
  const borrows: BorrowAsset[] = React.useMemo(() => {
    const assets = props.borrowedList ?? [];
    return assets.map(asset => {
      return asset.symbol === "WXDAI"
        ? {
            ...asset,
            symbol: "XDAI",
          }
        : asset;
    });
  }, [props.borrowedList]);
  const borrowTable = React.useMemo(() => <BorrowTable activeType="All" />, []);
  const myBorrows = React.useMemo(
    () => <MyBorrowsTable borrows={borrows} />,
    [borrows]
  );
  return (
    <Flex
      flexDirection={{ base: "column", md: "row" }}
      px={{ base: "0.5rem", md: "0" }}
      my={10}
      height="100%"
      alignItems="flex-start"
    >
      <Box
        boxSizing="content-box"
        rounded="xl"
        minH="12.75rem"
        w="100%"
        bg="primary.900"
        py="2rem"
        mb={{ base: "1rem", md: "0" }}
        color="white"
      >
        <VStack
          divider={
            <StackDivider
              borderColor="#36CFA2"
              h="0.188rem"
              backgroundColor="#36CFA2"
            />
          }
          spacing={4}
          align="stretch"
          flexDirection="column"
        >
          <Box
            h={{
              base: 20, // 0-48em
              md: 45, // 48em-80em,
              xl: 25, // 80em+
            }}
            ml={{
              md: 27,
              xl: 27,
            }}
            mb={{
              base: 5,
              md: 5,
              xl: 0,
            }}
            maxW={{
              base: "100%", // 0-48em
              md: "90%", // 48em-80em,
              xl: "70%", // 80em+
            }}
            d="flex"
            flexGrow={1}
            flexDirection={{ base: "column", md: "row", xl: "row" }}
          >
            <Box
              d="flex"
              flexDirection={{ base: "row", md: "column", xl: "row" }}
              justifyContent="center"
              h="100%"
            >
              <Text>Available to borrow</Text>
            </Box>
          </Box>
          <Box w="100%" pl={27} pr={27} pt={5}>
            {/* Disabled for now, no enough rows to be filtered */}
            {/* <Search
                placeholder="Search"
                w={185}
                h={26}
              /> */}
            <Box overflowY="auto">{borrowTable}</Box>
          </Box>
        </VStack>
      </Box>
      <Box w={{ base: "100%", md: "auto" }}>{myBorrows}</Box>
    </Flex>
  );
};
