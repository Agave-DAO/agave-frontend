import React from 'react';
import { store as NotificationManager } from 'react-notifications-component';
import coloredAgaveLogo from '../../assets/image/colored-agave-logo.svg';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { injectedConnector } from '../../hooks/injectedConnectors';
import { internalAddressesPerNetwork } from '../../utils/contracts/contractAddresses/internalAddresses';
import { Box, Center, Text, Button, List, ListItem } from '@chakra-ui/react';

function warnUser(title: string, message?: string | undefined): void {
  NotificationManager.addNotification({
    container: 'top-right',
    type: 'warning',
    title,
    message,
  });
}

const PrivacySection = (
  <Box className='privacy'>
    <Box className='paragraph'>
      By unlocking Your wallet You agree to our <b>Terms of Service</b>,{' '}
      <b>Privacy</b> and <b>Cookie Policy</b>.
    </Box>
    <Box className='paragraph'>
      <b>Disclaimer:</b> Wallets are provided by External Providers and by
      selecting you agree to Terms of those Providers. Your access to the wallet
      might be reliant on the External Provider being operational.
    </Box>
  </Box>
);

const UnlockWallet: React.FC<{}> = (props) => {
  const { activate, error } = useWeb3React();

  let detail = null;
  if (error && error instanceof UnsupportedChainIdError) {
    const firstIntegerRegex = /(\d+)/;
    const selectedChain = error.message.match(firstIntegerRegex)?.[0];
    detail = (
      <>
        <Text
          mt='1.3rem'
          mb='6px'
          bg='linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);'
          backgroundClip='text'
          textFillColor='transparent'
          fontWeight='bold'
        >
          Agave Unsupported Network
        </Text>
        <Text color='white' textAlign='center' mb='1.6rem'>
          Please change your wallet selection to one of our supported networks.
        </Text>

        {selectedChain ? (
          <Text color='white' textAlign='center' mb='1.6rem'>
            Currently selected chain: {selectedChain}
          </Text>
        ) : null}
        <Box>
          <Text color='white'>Supported chains:</Text>
          <List spacing={3}>
            {Object.entries(internalAddressesPerNetwork).map(
              ([name, addrs]) => (
                <ListItem key={name} color='white'>
                  {name}: {addrs.chainId}
                </ListItem>
              )
            )}
          </List>
        </Box>
      </>
    );
  }

  const onMetamaskConnect = async () => {
    if (typeof (window as any).ethereum === 'undefined') {
      warnUser(
        'Please install MetaMask!',
        'Agaave requires Metamask to be installed in your browser to work properly.'
      );
      return;
    }
    await activate(injectedConnector);
  };

  return (
    <Center
      minW='31vw'
      maxW='53.6rem'
      minH='40vh'
      maxH='33.6rem'
      m='auto'
      px='7.2rem'
      bg='primary.500'
      flexDirection='column'
      rounded='lg'
    >
      <img src={coloredAgaveLogo} alt='Colored Agave' />
      {detail || (
        <>
          {' '}
          <Text
            mt='1.3rem'
            mb='6px'
            bg='linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);'
            backgroundClip='text'
            textFillColor='transparent'
            fontWeight='bold'
          >
            Connect your wallet
          </Text>
          <Text color='white' textAlign='center' mb='2.6rem'>
            To see your deposited / borrowed assets, you need to connect your
            wallet to xDai network.
          </Text>
          <Button
            minW='15.8rem'
            py='.8rem'
            color='secondary.900'
            bg='linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);'
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
