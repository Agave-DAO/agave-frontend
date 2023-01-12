import React, { useMemo,ReactNode, useEffect } from "react";
import { Box, Center, Text, VStack, Button, Modal, ModalOverlay, ModalContent, ModalFooter, Spinner, Input, InputProps, StackDivider } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/hooks";
import { fontSizes, spacings } from "../../utils/constants";
import { BigNumber, FixedNumber } from "ethers";
import { useHistory, useRouteMatch } from "react-router-dom";
import ColoredText from "../../components/ColoredText";
import { OneTaggedPropertyOf, PossibleTags } from "../../utils/types";
import { useUserAssetBalance } from "../../queries/userAssets";
import { bigNumberToString } from "../../utils/fixedPoint";
import { DepositDash } from "../Deposit/DepositDash";
import {
  useApprovalMutation,
  UseApprovalMutationProps,
} from "../../mutations/approval";
import { useChainAddresses } from "../../utils/chainAddresses";
import { ControllerItem } from "../../components/ControllerItem";
import {
  useDepositMutation,
  UseDepositMutationProps,
} from "../../mutations/depositByWrap";
import {
    ReserveOrNativeTokenDefinition,
    isReserveTokenDefinition,
    useTokenDefinitionBySymbol,
    NATIVE_TOKEN,
  } from "../../queries/allReserveTokens";
import { StepperBar, WizardOverviewWrapper } from "../common/Wizard";
import { MINIMUM_NATIVE_RESERVE } from "../../utils/constants";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";
import { DashOverviewIntro } from "../common/DashOverview";
import { internalAddressesPerNetwork } from "../../utils/contracts/contractAddresses/internalAddresses";
import { tokenAddresses } from "../../queries/userTokenBalances";

interface AmountSelectedState {
  amountToDeposit: BigNumber;
  targetToken: string;
  sourceToken: string;
}

interface DepositTXState extends AmountSelectedState {}

interface DepositedTXState extends DepositTXState {}



type DepositState = OneTaggedPropertyOf<{
  amountSelected: AmountSelectedState;
  depositTx: DepositTXState;
  depositedTx: DepositedTXState;
}>;

function createState<SelectedState extends PossibleTags<DepositState>>(
  type: SelectedState,
  value: DepositState[SelectedState]
): DepositState {
  return {
    type,
    [type]: value,
  } as any;
}
  
const stateNames: Record<PossibleTags<DepositState>, string> = {
  amountSelected: "Approval",
  depositTx: "Wrap",
  depositedTx: "Finish",
};

const visibleStateNames: ReadonlyArray<PossibleTags<DepositState>> = [
  "amountSelected",
  "depositTx",
  "depositedTx",
] as const;

const DepositTitle = "Overview";

const AmountSelectedComp: React.FC<{
    state: AmountSelectedState;
    dispatch: (nextState: DepositState) => void;
  }> = ({ state, dispatch }) => {
    const approvalArgs = React.useMemo<UseApprovalMutationProps>(
      () => ({
        asset: tokenAddresses[state.sourceToken],
        amount: state.amountToDeposit,
        spender: tokenAddresses[state.targetToken],
      }),
      [state, tokenAddresses]
    );
    const {
      approvalMutation: { mutateAsync },
    } = useApprovalMutation(approvalArgs);
    const onSubmit = React.useCallback(() => {
      mutateAsync()
        .then(() => dispatch(createState("depositTx", { ...state })))
        .catch(e => console.log(e));
    }, [state, dispatch, mutateAsync]);
    const currentStep: PossibleTags<DepositState> = "amountSelected";
    const stepperBar = React.useMemo(
      () => (
        <StepperBar
          states={visibleStateNames}
          currentState={currentStep}
          stateNames={stateNames}
        />
      ),
      [currentStep]
    );
    return (

      <>
        {stepperBar}
        <Button 
          width="30%"
          mt="20px !important"
          textTransform="uppercase"
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>onSubmit()}
          bg="secondary.900"
        >
          Approve
        </Button>
      </>

    );
};


const DepositTxComp: React.FC<{
  state: DepositTXState;
  dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
    const depositArgs = React.useMemo<UseDepositMutationProps>(
      () => ({
        asset: tokenAddresses[state.sourceToken],
        amount: state.amountToDeposit,
        spender: tokenAddresses[state.targetToken],
      }),
      [state, tokenAddresses]
    );
    console.log(depositArgs);
    const {
      depositMutation: { mutateAsync },
    } = useDepositMutation(depositArgs);
    const onSubmit = React.useCallback(() => {
      mutateAsync()
      .then(() => dispatch(createState("depositedTx", { ...state })))
        .catch(e => console.log(e));
    }, [state, dispatch, mutateAsync]);
    const currentStep: PossibleTags<DepositState> = "depositTx";
    const stepperBar = React.useMemo(
      () => (
        <StepperBar
          states={visibleStateNames}
          currentState={currentStep}
          stateNames={stateNames}
        />
      ),
      [currentStep]
    );
    return (
      <>
        {stepperBar}
        <Button 
          width="30%"
          mt="20px !important"
          textTransform="uppercase"
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>onSubmit()}
          bg="secondary.900"
        >
          Wrap tokens
        </Button>
      </>
    );
};

const DepositedTxComp: React.FC<{
    state: DepositedTXState;
    dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
    const history = useHistory();
    const currentStep: PossibleTags<DepositState> = "depositedTx";
    const decimals = useDecimalCountForToken(tokenAddresses[state.sourceToken]).data;
    const stepperBar = React.useMemo(
      () => (
        <StepperBar
          states={visibleStateNames}
          currentState={currentStep}
          stateNames={stateNames}
        />
      ),
      [currentStep]
    );
    return (
      <>
        {stepperBar}
        <Button 
          width="30%"
          mt="20px !important"
          textTransform="uppercase"
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>history.push("/wrap")}
          bg="secondary.900"
        >
          Finish
        </Button>
      </>
    );
};
  
const DepositStateMachine: React.FC<{
  state: DepositState;
  setState: (newState: DepositState) => void;
}> = ({ state, setState }) => {
    switch (state.type) {
      case "amountSelected":
        return (
          <AmountSelectedComp state={state.amountSelected} dispatch={setState} />
        );
      case "depositTx":
        return <DepositTxComp state={state.depositTx} dispatch={setState} />;
      case "depositedTx":
        return <DepositedTxComp state={state.depositedTx} dispatch={setState} />;
    }
};

export const Wrapping: React.FC<{
  type: "wrap" | "unwrap";
  sourceToken: string;
  targetToken: string;
  amount: BigNumber | undefined;
  decimals: BigNumber;
}> = ({
  type,
  sourceToken,
  targetToken,
  amount,
  decimals
}) => {


  // TODO

  const [depositState, setDepositState] = React.useState<DepositState>(() =>
    createState("amountSelected", { amountToDeposit: BigNumber.from(amount), targetToken:targetToken, sourceToken:sourceToken })
  );

  return (
    <VStack
      spacing={4}
      w="90%"
      align="center"
      flexDirection="column"
    >
      <ColoredText
        fontSize="1.8rem"
      >
        {type=="wrap"?"Wrap tokens":"Unwrap tokens"}
      </ColoredText>
      <Box
            rounded="5px"
            padding="3px 10px"
            fontSize="1.4rem"      
      >
        <HStack fontWeight="bold">
          <Box
            rounded="5px"
            bg="secondary.100"
            border="2px solid var(--chakra-colors-secondary-900)"
            padding="3px 10px"
            fontSize="1.4rem"
          >{sourceToken}</Box>
          <Box color="secondary.900" fontWeight="bold"> ⇒ </Box>
          <Box
            rounded="5px"
            bg="secondary.100"
            border="2px solid var(--chakra-colors-secondary-900)"
            padding="3px 10px"
            fontSize="1.4rem"
          >{targetToken}</Box>
        </HStack>
        <Box
          fontWeight="bold"
          fontSize="1.8rem"
          mt="10px"
        >
          {FixedNumber.fromValue(BigNumber.from(amount), decimals).toString()}
        </Box>
      </Box>


      <DepositStateMachine state={depositState} setState={setDepositState} />

    </VStack>
  )

}

