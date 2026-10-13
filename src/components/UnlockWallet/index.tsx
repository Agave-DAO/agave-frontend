import React, { useState } from "react";
import { Store as NotificationManager } from "react-notifications-component";
import coloredAgaveLogo from "../../assets/image/colored-agave-logo.svg";
import { UnsupportedChainIdError } from "@web3-react/core";
import { BrowserWallet, BrowserWalletConnector, useBrowserWallets } from "../../hooks/browserWallets";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";
import {
  Box,
  Center,
  Text,
  Button,
  Stack,
  HStack,
} from "@chakra-ui/react";
import { fontSizes, spacings } from "../../utils/constants";
import { changeChain } from "../../utils/changeChain";
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
      <a href="https://discord.gg/bkVwdxSfCn" target="_blank" rel="noopener noreferrer">
        <ColoredText>Discord</ColoredText>
      </a>
    </HStack>
  </Box>
);

export const UnlockWallet: React.FC<{}> = props => {
  const { connector, activate, deactivate, error } = useAppWeb3();
  const wallets = useBrowserWallets();
  const [selectedConnector, setSelectedConnector] = useState<BrowserWalletConnector>();
  const [connecting, setConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState<Error>();
  const walletConnector = selectedConnector ?? (connector instanceof BrowserWalletConnector ? connector : undefined);
  const walletError = connectionError ?? error;

  const onConnect = async (wallet: BrowserWallet) => {
    const connector = new BrowserWalletConnector(wallet.provider);
    setSelectedConnector(connector);
    setConnecting(true);
    setConnectionError(undefined);
    try {
      await activate(connector, undefined, true);
    } catch (error) {
      setConnectionError(error instanceof Error ? error : new Error("Wallet connection failed"));
      if (!(error instanceof UnsupportedChainIdError)) {
        warnUser("Wallet connection failed", error instanceof Error ? error.message : "Please try again");
      }
    } finally {
      setConnecting(false);
    }
  };

  const onSwitchChain = async () => {
    if (!walletConnector) return;
    setConnecting(true);
    try {
      if (await changeChain(walletConnector, internalAddressesPerNetwork.Gnosis.chainName)) {
        await activate(walletConnector, undefined, true);
        setConnectionError(undefined);
      } else {
        warnUser("Network change failed", "Please select Gnosis Chain in your wallet");
      }
    } catch {
      warnUser("Network change failed", "Please select Gnosis Chain in your wallet");
    } finally {
      setConnecting(false);
    }
  };

  let detail = null;
  if (walletError && walletError instanceof UnsupportedChainIdError) {
    const firstIntegerRegex = /(\d+)/;
    const selectedChain = walletError.message.match(firstIntegerRegex)?.[0];
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
            <Button onClick={onSwitchChain} isDisabled={connecting || !walletConnector}>
              Switch to Gnosis Chain
            </Button>
            <Button isDisabled={connecting} onClick={() => {
              deactivate();
              setConnectionError(undefined);
              setSelectedConnector(undefined);
            }}>
              Choose another wallet
            </Button>
          </Stack>
          {PrivacySection}
        </Box>
      </Center>
    );
  }

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
            wallet to Gnosis Chain.
          </Text>
          <Stack>
            {wallets.map(wallet => (
              <Button
                key={wallet.info.uuid}
                minW={{ base: "100%", md: "15.8rem" }}
                fontSize={{ base: fontSizes.md, md: "inherit" }}
                py={{ base: "1.5rem", md: ".8rem" }}
                color="secondary.900"
                bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
                onClick={() => onConnect(wallet)}
                isDisabled={connecting}
              >
                {wallet.info.name}
              </Button>
            ))}
            {wallets.length === 0 && (
              <Text color="white" textAlign="center">
                No browser wallet detected. Install Rabby, Ambire, or MetaMask, then refresh this page.
              </Text>
            )}
          </Stack>
        </>
      )}
    </Center>
  );
};
