import React, { useMemo } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { store as NotificationManager } from "react-notifications-component";
import coloredAgaveLogo from "../../assets/image/colored-agave-logo.svg";
import { UnsupportedChainIdError } from "@web3-react/core";
import {
  frameConnector,
  injectedConnector,
  walletConnectConnector,
} from "../../hooks/injectedConnectors";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";
import {
  Box,
  Center,
  Text,
  Button,
  useColorModeValue as mode,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { fontSizes, spacings } from "../../utils/constants";
import { changeChain } from "../../utils/changeChain";
import { URI_AVAILABLE } from "@web3-react/walletconnect-connector";
import ColoredText from "../ColoredText";
import { useAppWeb3 } from "../../hooks/appWeb3";

function warnUser(title: string, message?: string | undefined): void {
  NotificationManager.addNotification({
    container: "top-right",
    type: "warning",
    title,
    message,
  });
}

const PrivacySection = (
  <Box
    fontSize={{ base: "1rem", md: fontSizes.md }}
    color="white"
    className="privacy"
    my="2rem"
  >
    <Text fontSize={{ base: "1.2rem", md: fontSizes.md }}>
      By unlocking Your wallet You agree to our{" "}
      <strong style={{ fontSize: "inherit" }}>Terms of Service</strong>,{" "}
      <strong style={{ fontSize: "inherit" }}>Privacy</strong> and{" "}
      <strong style={{ fontSize: "inherit" }}>Cookie Policy</strong>.
    </Text>
    <Text my="1.5rem" fontSize={{ base: "1.2rem", md: fontSizes.md }}>
      <strong style={{ fontSize: "inherit" }}>Disclaimer:</strong> Wallets are
      provided by External Providers and by selecting you agree to Terms of
      those Providers. Your access to the wallet might be reliant on the
      External Provider being operational.
    </Text>

    <Text fontSize={{ base: "1.4rem", md: fontSizes.lg }}>
      Do you need help?
    </Text>
    <HStack>
      <Text fontSize={{ base: "1.2rem", md: fontSizes.md }}>
        {" "}
        Contact us on
      </Text>
      <a href="https://discord.gg/bkVwdxSfCn" target="_blank">
        <ColoredText>Discord</ColoredText>
      </a>
    </HStack>
  </Box>
);

export const UnlockWallet: React.FC<{}> = props => {
  const { connector, activate, error } = useAppWeb3();

  const isMetamask = connector instanceof InjectedConnector;
  const availableChains = useMemo(
    () =>
      Object.entries(internalAddressesPerNetwork).map(([name, addrs]) =>
        isMetamask ? (
          <Button
            key={name}
            bg={mode({ base: "primary.500", md: "primary.500" }, "primary.500")}
            colorScheme="teal"
            size="xl"
            h="40px"
            onClick={() => connector ? changeChain(connector, addrs.chainName) : null}
          >
            {addrs.chainName}
          </Button>
        ) : (
          <Text key={name} color="white">
            {name}: {addrs.chainId}
          </Text>
        )
      ),
    [isMetamask]
  );

  let detail = null;
  if (error && error instanceof UnsupportedChainIdError) {
    const firstIntegerRegex = /(\d+)/;
    const selectedChain = error.message.match(firstIntegerRegex)?.[0];
    detail = (
      <Center flexDirection="column">
        <Text
          mt={spacings.md}
          fontSize={{ base: "1.6rem", md: "inherit" }}
          mb="6px"
          bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          backgroundClip="text"
          fontWeight="bold"
        >
          Agave Unsupported Network
        </Text>
        <Text
          color="white"
          textAlign="center"
          fontSize={{ base: fontSizes.md, md: "inherit" }}
          mb={{ base: ".8rem", md: "1.6rem" }}
        >
          Please change your wallet selection to one of our supported networks.
        </Text>

        {selectedChain ? (
          <Text
            color="white"
            textAlign="center"
            mb={{ base: ".8rem", md: "1.6rem" }}
            fontSize={{ base: fontSizes.md, md: "inherit" }}
          >
            Currently selected chain ID: {selectedChain}
          </Text>
        ) : null}
        <Box>
          <Text color="white">Supported chains:</Text>
          <Stack spacing={4} direction="column">
            {availableChains}
          </Stack>
          {PrivacySection}
        </Box>
      </Center>
    );
  }

  const onMetamaskConnect = async () => {
    if (typeof (window as any).ethereum === "undefined") {
      warnUser(
        "Please install MetaMask!",
        "Agave requires Metamask to be installed in your browser to work properly."
      );
      return;
    }
    await activate(injectedConnector);
  };

  const onFrameConnect = async () => {
    await activate(frameConnector);
  };

  const onWalletConnect = async () => {
    walletConnectConnector.once(URI_AVAILABLE, uri => {
      console.log(`WalletConnect URI: ${uri}`);
    });
    await activate(walletConnectConnector);
  };

  return (
    <Center
      minW={{ md: "31vw" }}
      maxW={{ base: "90vw", lg: "53.6rem" }}
      minH={{ base: "33.6rem", md: "40vh" }}
      maxH="max-content"
      m={{ base: "4rem auto", md: "auto" }}
      px={{ base: "4.3rem", md: "7.2rem" }}
      bg="primary.900"
      flexDirection="column"
      rounded="lg"
      py={{ base: "4rem", md: "5rem" }}
    >
      <img src={coloredAgaveLogo} alt="Colored Agave" />
      {detail || (
        <>
          {" "}
          <Text
            mt={spacings.md}
            mb="6px"
            bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
            backgroundClip="text"
            // textFillColor="transparent"
            fontWeight="bold"
            fontSize={{ base: "1.6rem", md: "inherit" }}
          >
            Connect your wallet
          </Text>
          <Text
            color="white"
            textAlign="center"
            mb="2.6rem"
            fontSize={{ base: fontSizes.md, md: "inherit" }}
          >
            To see your deposited / borrowed assets, you need to connect your
            wallet to xDai network.
          </Text>
          <Stack>
            <Button
              minW={{ base: "100%", md: "15.8rem" }}
              fontSize={{ base: fontSizes.md, md: "inherit" }}
              py={{ base: "1.5rem", md: ".8rem" }}
              color="secondary.900"
              bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
              onClick={onMetamaskConnect}
            >
              MetaMask
            </Button>
            <Button
              minW={{ base: "100%", md: "15.8rem" }}
              fontSize={{ base: fontSizes.md, md: "inherit" }}
              py={{ base: "1.5rem", md: ".8rem" }}
              color="secondary.900"
              bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
              onClick={onFrameConnect}
            >
              Frame
            </Button>
            <Button
              minW={{ base: "100%", md: "15.8rem" }}
              fontSize={{ base: fontSizes.md, md: "inherit" }}
              py={{ base: "1.5rem", md: ".8rem" }}
              color="secondary.900"
              bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
              onClick={onWalletConnect}
            >
              WalletConnect
            </Button>
          </Stack>
        </>
      )}
    </Center>
  );
};
