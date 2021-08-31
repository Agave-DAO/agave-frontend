import React from "react";
import { Link, Center, Text, HStack, Image, Circle } from "@chakra-ui/react";
import { LINEAR_GRADIENT_BG } from "../../utils/constants";

import externalLink from "../../assets/image/external-link.svg";
import pendingSymb from "../../assets/image/loading.svg";
import { getChainAddresses } from "../../utils/chainAddresses";
import { useAppWeb3 } from "../../hooks/appWeb3";

type TransactionLogProps = {
  log: {
    txHash: string;
    isComplete: boolean;
    stepName: string;
  };
};

export const TransactionLog: React.FC<TransactionLogProps> = ({
  log: { txHash, isComplete, stepName },
}) => {
  const { chainId } = useAppWeb3();
  const chainAddresses = chainId ? getChainAddresses(chainId) : undefined;
  return (
    <Center
      w="100%"
      key={txHash}
      borderTop="1px solid"
      borderTopColor="yellow.100"
      justifyContent="space-between"
      fontSize="1rem"
      px="1.2rem"
      py=".3rem"
    >
      <Text fontSize="1rem">{stepName}</Text>
      {isComplete ? (
        <HStack alignItems="center">
          <Text fontSize="1rem">Confirmed </Text>
          <Circle bg={LINEAR_GRADIENT_BG} w=".6rem" h=".6rem" />
        </HStack>
      ) : (
        <HStack alignItems="center">
          <Text fontSize="1rem">Pending</Text>
          <Image src={pendingSymb} boxSize="1.1rem" />
        </HStack>
      )}
      {chainAddresses?.explorer ? (
        <HStack
          as={Link}
          href={`${chainAddresses?.explorer}/tx/${txHash}`}
          textDecoration="none !important"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Text fontSize="1rem">Explorer</Text>
          <Image src={externalLink} boxSize=".8rem" />
        </HStack>
      ) : null}
    </Center>
  );
};
