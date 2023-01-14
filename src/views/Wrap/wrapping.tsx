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
} from "../../mutations/wrap";

import {
  useWithdrawMutation,
  UseWithdrawMutationProps,
} from "../../mutations/unwrap";
import { useAppWeb3 } from "../../hooks/appWeb3";
import { StepperBar } from "../common/Wizard";
import { useDecimalCountForToken } from "../../queries/decimalsForToken";
import { tokenAddresses } from "../../queries/userTokenBalances";
import { finishDraft } from "immer";
import { userTokenBalances } from "../../queries/userTokenBalances";

interface ApprovalState {
  amount: BigNumber;
  targetToken: string;
  sourceToken: string;
  resetBox: any;
  type: string;
}

interface TXState extends ApprovalState {}

interface FinishState extends TXState {}

type ActionState = OneTaggedPropertyOf<{
  doApproval: ApprovalState;
  doTX: TXState;
  doneTX: FinishState;
}>;

function createState<SelectedState extends PossibleTags<ActionState>>(
  type: SelectedState,
  value: ActionState[SelectedState]
): ActionState {
  return {
    type,
    [type]: value,
  } as any;
}
  
const stateNames: Record<PossibleTags<ActionState>, string> = {
  doApproval: "Approval",
  doTX: "Wrapping",
  doneTX: "Finish",
};

const visibleStateNames: ReadonlyArray<PossibleTags<ActionState>> = [
  "doApproval",
  "doTX",
  "doneTX",
] as const;

const DepositTitle = "Overview";

const ApprovalStep: React.FC<{
    state: ApprovalState;
    dispatch: (nextState: ActionState) => void;
  }> = ({ state, dispatch }) => {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const approvalArgs = React.useMemo<UseApprovalMutationProps>(
      () => ({
        asset: tokenAddresses[state.sourceToken],
        amount: state.amount,
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
            dispatch(createState("doTX", { ...state }));
          })
          .catch(e => {
            setIsSubmitting(false);
            console.log(e);
          });
        }
      }, [state, dispatch, mutateAsync, isSubmitting]);

    const currentStep: PossibleTags<ActionState> = "doApproval";
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


const DepositStep: React.FC<{
  state: TXState;
  dispatch: (nextState: ActionState) => void;
}> = ({ state, dispatch }) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const args = React.useMemo<UseDepositMutationProps>(
    () => ({
      asset: tokenAddresses[state.sourceToken],
      amount: state.amount,
      spender: tokenAddresses[state.targetToken],
    }),
    [state, tokenAddresses]
  );
  const {
    depositMutation: { mutateAsync },
  } = useDepositMutation(args);
  const onSubmit = React.useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      mutateAsync()
        .then(() => {
          setIsSubmitting(false);
          dispatch(createState("doneTX", { ...state }));
        })
        .catch(e => {
          setIsSubmitting(false);
          console.log(e)
        });
      }
    }, [state, dispatch, mutateAsync, isSubmitting]);
  const currentStep: PossibleTags<ActionState> = "doTX";
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
        {isSubmitting?"Waiting...":"WRAP"}
      </Button>
    </>
  );
};


const WithdrawStep: React.FC<{
  state: TXState;
  dispatch: (nextState: ActionState) => void;
}> = ({ state, dispatch }) => {
  const { account } = useAppWeb3();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const args = React.useMemo<UseWithdrawMutationProps>(
    () => ({
      asset: tokenAddresses[state.targetToken],
      recipientAccount: account ?? undefined,
      amount: state.amount,
      spender: tokenAddresses[state.sourceToken],
    }),
    [state, tokenAddresses]
  );
  const {
    withdrawMutation: { mutateAsync },
  } = useWithdrawMutation(args);
  const onSubmit = React.useCallback(() => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      mutateAsync()
        .then(() => {
          setIsSubmitting(false);
          dispatch(createState("doneTX", { ...state }));
        })
        .catch(e => {
          setIsSubmitting(false);
          console.log(e)
        });
      }
    }, [state, dispatch, mutateAsync, isSubmitting]);
  const currentStep: PossibleTags<ActionState> = "doTX";
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
        {isSubmitting?"Waiting...":"UNWRAP"}
      </Button>
    </>
  );
};



const FinishStep: React.FC<{
    state: FinishState;
    dispatch: (nextState: ActionState) => void;
}> = ({ state, dispatch }) => {
    const history = useHistory();
    const currentStep: PossibleTags<ActionState> = "doneTX";
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
          onClick={()=>state.resetBox(state.type)}
          bg="secondary.900"
        >
          FINISH
        </Button>
      </>
    );
};

const ActionStateMachine: React.FC<{
  state: ActionState;
  setState: (newState: ActionState) => void;
  txType: string;
}> = ({ state, setState, txType }) => {
    switch (state.type) {
      case "doApproval":
        return <ApprovalStep state={state.doApproval} dispatch={setState} />;
      case "doTX":
        if (txType=="wrap") {
          return <DepositStep state={state.doTX} dispatch={setState} />;
        } else {
          return <WithdrawStep state={state.doTX} dispatch={setState} />;
        }
      case "doneTX":
        return <FinishStep state={state.doneTX} dispatch={setState} />;
    }
};

export const Wrapping: React.FC<{
  type: "wrap" | "unwrap";
  sourceToken: string;
  targetToken: string;
  amount: BigNumber | undefined;
  decimals: BigNumber;
  resetBox: any;
}> = ({
  type,
  sourceToken,
  targetToken,
  amount,
  decimals,
  resetBox,
}) => {

  const [actionState, setActionState] = React.useState<ActionState>(() =>
    type=="wrap"?(
      createState("doApproval", { amount: BigNumber.from(amount), targetToken:targetToken, sourceToken:sourceToken, resetBox:resetBox, type:type })
    ):(
      createState("doTX", { amount: BigNumber.from(amount), targetToken:targetToken, sourceToken:sourceToken, resetBox:resetBox, type:type })
    )
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
        <ActionStateMachine state={actionState} setState={setActionState} txType={type} />
      </VStack>

    </Box>
  )

}

