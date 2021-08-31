import React, { useMemo } from "react";
import {
  Text,
  Center,
  Button,
  Badge,
  Image,
  useColorMode,
  useColorModeValue as mode,
} from "@chakra-ui/react";
import darkMoon from "../../../assets/image/dark-moon.svg";
import lightMoon from "../../../assets/image/light-moon.svg";
import { selectAddress } from "../../../features/auth/authSlice";
import { useAppSelector } from "../../../redux/hooks";
import { bigNumberToString } from "../../../utils/fixedPoint";
import { useUserAssetBalance } from "../../../queries/userAssets";
import { useAmountAvailableToStake } from "../../../queries/amountAvailableToStake";
import ColoredText from "../../ColoredText";

export const UserProfile: React.FC<{}> = () => {
  // Light/Dark button functions
  const { colorMode, toggleColorMode } = useColorMode();

  // Address button functions
  const address: string | undefined = useAppSelector(selectAddress);
  const addressPretty = useMemo(
    () =>
      address
        ? `${address.substring(0, 4)}...${address.substring(
            address.length - 4,
            address.length
          )}`
        : "Not Connected",
    [address]
  );

  // Agve button functions
  const { data: agaveBalance } = useAmountAvailableToStake(address);
  const userBal = agaveBalance ? bigNumberToString(agaveBalance, 3) : "0";

  return (
    <>
      {/* NIGHTMODE 
      <Center
        width={{ base: "4rem", md: "3rem" }}
        height={{ base: "4rem", md: "3rem" }}
        rounded="lg"
        bg={mode({ base: "primary.800", md: "primary.500" }, "primary.500")}
        cursor="pointer"
        onClick={toggleColorMode}
      >
        <Image
          src={colorMode === "dark" ? darkMoon : lightMoon}
          alt="theme-mode"
        />
        
    </Center>*/}
      <Center
        minWidth="10rem"
        height={{ base: "4rem", md: "3rem" }}
        fontSize={{ base: "4xl", md: "2xl" }}
        mx="1.5rem"
        textTransform="uppercase"
        color="white"
        bg={mode({ base: "secondary.800", md: "primary.500" }, "primary.500")}
        rounded="lg"
        px="5px"
      >
        <Text mr="5px">{userBal}</Text>
        <Text font-weight="400">AGVE</Text>
      </Center>

      <Center
        background={mode(
          { base: "secondary.800", md: "primary.500" },
          "primary.500"
        )}
        rounded="lg"
        minWidth="10rem"
        height={{ base: "4rem", md: "3rem" }}
        color="white"
        p="10px"
      >
        <Badge
          bg="yellow"
          rounded="full"
          width={{ base: "1.3rem", md: "1rem" }}
          height={{ base: "1.3rem", md: "1rem" }}
          mr="5px"
        />
        <Text fontSize={{ base: "4xl", md: "2xl" }}>{addressPretty}</Text>
      </Center>
    </>
  );
};
