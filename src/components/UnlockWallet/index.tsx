import React from "react";
import { store as NotificationManager } from "react-notifications-component";
import coloredAgaveLogo from "../../assets/image/colored-agave-logo.svg";
import { UnsupportedChainIdError, useWeb3React } from "@web3-react/core";
import { injectedConnector } from "../../hooks/injectedConnectors";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";
import { Box, Center, Text, Button, List, ListItem } from "@chakra-ui/react";

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
    fontSize={{ base: "1rem", md: "1.4rem" }}
    color="white"
    className="privacy"
    my="2rem"
  >
    <Text fontSize={{ base: "1.2rem", md: "1.4rem" }}>
      By unlocking Your wallet You agree to our{" "}
      <strong style={{ fontSize: "inherit" }}>Terms of Service</strong>,{" "}
      <strong style={{ fontSize: "inherit" }}>Privacy</strong> and{" "}
      <strong style={{ fontSize: "inherit" }}>Cookie Policy</strong>.
    </Text>
    <Text my="1.5rem" fontSize={{ base: "1.2rem", md: "1.4rem" }}>
      <strong style={{ fontSize: "inherit" }}>Disclaimer:</strong> Wallets are
      provided by External Providers and by selecting you agree to Terms of
      those Providers. Your access to the wallet might be reliant on the
      External Provider being operational.
    </Text>
  </Box>
);

const UnlockWallet: React.FC<{}> = props => {
  const { activate, error } = useWeb3React();

  let detail = null;
  if (error && error instanceof UnsupportedChainIdError) {
    const firstIntegerRegex = /(\d+)/;
    const selectedChain = error.message.match(firstIntegerRegex)?.[0];
    detail = (
      <Center flexDirection="column">
        <Text
          mt="1.3rem"
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
          fontSize={{ base: "1.4rem", md: "inherit" }}
          mb={{ base: ".8rem", md: "1.6rem" }}
        >
          Please change your wallet selection to one of our supported networks.
        </Text>

        {selectedChain ? (
          <Text
            color="white"
            textAlign="center"
            mb={{ base: ".8rem", md: "1.6rem" }}
            fontSize={{ base: "1.4rem", md: "inherit" }}
          >
            Currently selected chain: {selectedChain}
          </Text>
        ) : null}
        <Box>
          <Text color="white">Supported chains:</Text>
          <List spacing={3}>
            {Object.entries(internalAddressesPerNetwork).map(
              ([name, addrs]) => (
                <ListItem key={name} color="white">
                  {name}: {addrs.chainId}
                </ListItem>
              )
            )}
          </List>
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

  return (
    <Center
      minW={{ md: "31vw" }}
      maxW={{ base: "90vw", md: "53.6rem" }}
      minH={{ base: "33.6rem", md: "40vh" }}
      maxH="max-content"
      m="auto"
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
            mt="1.3rem"
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
            fontSize={{ base: "1.4rem", md: "inherit" }}
          >
            To see your deposited / borrowed assets, you need to connect your
            wallet to xDai network.
          </Text>
          <Button
            minW={{ base: "100%", md: "15.8rem" }}
            fontSize={{ base: "1.4rem", md: "inherit" }}
            py={{ base: "1.5rem", md: ".8rem" }}
            color="secondary.900"
            bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
            onClick={onMetamaskConnect}
          >
            Connect
          </Button>
        </>
      )}
    </Center>
  );
};

export default UnlockWallet;
