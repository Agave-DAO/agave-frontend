import { Center, Text } from "@chakra-ui/react";
import { BigNumber, constants } from "ethers";
import React from "react";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { getChainAddresses } from "../../utils/chainAddresses";
import { StakingLayout } from "./layout";
import { useCooldownMutation, useStakeMutation } from "./mutations";
import {
  useAmountAvailableToStake,
  useAmountClaimableBy,
  useAmountStakedBy,
  useStakingAgavePrice,
  useStakingCooldown,
  useStakingEvents,
  useStakingPerSecondPerAgaveYield,
} from "./queries";

export interface StakingProps {}

const StakingErrorWrapper: React.FC = ({ children }) => {
  return (
    <Center
      minW={["31vw"]}
      maxW="53.6rem"
      minH="40vh"
      maxH="33.6rem"
      m="auto"
      px="7.2rem"
      bg="primary.500"
      flexDirection="column"
      rounded="lg"
    >
      {children}
    </Center>
  );
};

export const Staking: React.FC<StakingProps> = _props => {
  const w3 = useAppWeb3(); // We don't unpack because otherwise typescript loses useAppWeb3's magic
  const {
    data: stakingPerSecondPerAgaveYield,
  } = useStakingPerSecondPerAgaveYield();
  const { data: amountStaked } = useAmountStakedBy(w3.account ?? undefined);
  const { data: availableToStake } = useAmountAvailableToStake(
    w3.account ?? undefined
  );
  const { data: availableToClaim } = useAmountClaimableBy(
    w3.account ?? undefined
  );
  const cooldownInfo = useStakingCooldown().data;
  const currentStakerCooldown = useStakingEvents(w3.account ?? undefined).data;
  const agavePriceInNative = useStakingAgavePrice().data;

  // Mutations
  const stakeMutation = useStakeMutation({
    chainId: w3.chainId ?? undefined,
    address: w3.account ?? undefined,
  });
  const stakeMutationCall = React.useMemo(
    () => (amount: BigNumber) =>
      w3.library
        ? stakeMutation.mutate({ amount, library: w3.library })
        : undefined,
    [stakeMutation, w3.library]
  );

  const cooldownMutation = useCooldownMutation({
    chainId: w3.chainId ?? undefined,
    address: w3.account ?? undefined,
  });
  const cooldownMutationCall = React.useMemo(
    () => () =>
      w3.library ? cooldownMutation.mutate({ library: w3.library }) : undefined,
    [cooldownMutation, w3.library]
  );

  if (w3.library == null) {
    return (
      <StakingErrorWrapper>
        <Text color="white">
          Staking requires access to Web3 via your wallet. Please connect it to
          continue.
        </Text>
      </StakingErrorWrapper>
    );
  }

  const chainAddrs = getChainAddresses(w3.chainId);
  if (chainAddrs == null) {
    return (
      <StakingErrorWrapper>
        <Text color="white">
          You are on an unsupported chain. How did you even do that?
        </Text>
      </StakingErrorWrapper>
    );
  }

  return (
    <StakingLayout
      yieldPerAgavePerSecond={stakingPerSecondPerAgaveYield}
      cooldownInfo={cooldownInfo}
      currentStakerCooldown={currentStakerCooldown}
      agavePriceUsd={agavePriceInNative}
      amountStaked={amountStaked}
      availableToClaim={availableToClaim}
      availableToStake={availableToStake}
      activateCooldown={cooldownMutationCall}
      claimRewards={(toAddress: string) => {}}
      stake={stakeMutationCall}
      unstake={() => {}}
    />
  );
};
