import React from "react";
import { Box, Center, Text, VStack, Button, Modal, ModalOverlay, ModalContent, ModalFooter, Spinner, Input, InputProps, StackDivider } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/layout";
import { fontSizes, spacings } from "../../utils/constants";
import { BigNumber, FixedNumber } from "ethers";
import { useHistory } from "react-router-dom";
import ColoredText from "../../components/ColoredText";
import { OneTaggedPropertyOf, PossibleTags } from "../../utils/types";
import { 
  useApprovalMutation,
  UseApprovalMutationProps,
} from "../../mutations/approval";
import {
  useDepositMutation,
  UseDepositMutationProps,
} from "../../mutations/depositByWrap";
import { StepperBar } from "../common/Wizard";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";
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
  depositTx: "Wrapping",
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
    const [isSubmitting, setIsSubmitting] = React.useState(false);
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
      if (!isSubmitting) {
        setIsSubmitting(true);
        mutateAsync()
          .then(() => {
            setIsSubmitting(false);
            dispatch(createState("depositTx", { ...state }));
          })
          .catch(e => {
            setIsSubmitting(false);
            console.log(e);
          });
        }
      }, [state, dispatch, mutateAsync, isSubmitting]);

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
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>onSubmit()}
          bg="secondary.900"
          disabled={isSubmitting}
        >
          {isSubmitting?"Waiting...":"APPROVE"}
        </Button>
      </>

    );
};


const DepositTxComp: React.FC<{
  state: DepositTXState;
  dispatch: (nextState: DepositState) => void;
}> = ({ state, dispatch }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const depositArgs = React.useMemo<UseDepositMutationProps>(
      () => ({
        asset: tokenAddresses[state.sourceToken],
        amount: state.amountToDeposit,
        spender: tokenAddresses[state.targetToken],
      }),
      [state, tokenAddresses]
    );
    const {
      depositMutation: { mutateAsync },
    } = useDepositMutation(depositArgs);

    const onSubmit = React.useCallback(() => {
      if (!isSubmitting) {
        setIsSubmitting(true);
        mutateAsync()
          .then(() => {
            setIsSubmitting(false);
            dispatch(createState("depositedTx", { ...state }));
          })
          .catch(e => {
            setIsSubmitting(false);
            console.log(e)
          });
        }
      }, [state, dispatch, mutateAsync, isSubmitting]);


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
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>onSubmit()}
          bg="secondary.900"
          disabled={isSubmitting}
        >
          {isSubmitting?"Waiting...":"WRAP TOKENS"}
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
          background="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
          color="secondary.900"
          fontWeight="bold"
          px={{ base: "10rem", md: "6rem" }}
          py="1.5rem"
          fontSize={fontSizes.md}
          onClick={()=>history.push("/wrap")}
          bg="secondary.900"
        >
          FINISH
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

  const [depositState, setDepositState] = React.useState<DepositState>(() =>
    createState("amountSelected", { amountToDeposit: BigNumber.from(amount), targetToken:targetToken, sourceToken:sourceToken })
  );

  return (
    <Box
      w="100%"
      maxW="100%"
      px={{ base: "1.1rem", md: "2.2rem" }}
      py={{ base: spacings.md, md: "1.5rem" }}
      bg="secondary.900"
      rounded="2xl"
      position="relative"
      minW="40%"
      mx={{ base: "0.5rem", md: "1rem" }}
      my="1rem"
      align="center"
    >
      <VStack
        spacing={4}
        w="100%"
        align="center"
        flexDirection="column"
      >
        <DepositStateMachine state={depositState} setState={setDepositState} />
      </VStack>

    </Box>
  )

}

