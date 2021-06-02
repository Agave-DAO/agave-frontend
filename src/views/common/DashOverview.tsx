import { Center, Circle, HStack, Link, Text, VStack } from "@chakra-ui/layout";
import { useCallback, useEffect, useMemo, useState } from "react";
import ColoredText from "../../components/ColoredText";
import InfoWeiBox from "./InfoWeiBox";
import { BigNumber } from "ethers";
import { Button } from "@chakra-ui/button";
import ModalIcon from "../../components/ModalIcon";
import { Image } from "@chakra-ui/image";

import daiLogo from "../../assets/image/coins/dai.svg";
import externalLink from "../../assets/image/external-link.svg";
import pendingSymb from "../../assets/image/loading.svg";

type TxData = {
  txHash: string;
  completedAt: Date | null;
  stepName: string;
  isComplete: boolean;
};

const LINEAR_GRADIENT_BG =
  "linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%)";

// TODO: DELETE ONCE DONE WITH LOGIC :)
const fakeApprove = async () =>
  "0x41d7990d940f8fb6198b2a7b33940bd0526ed17b8695e7e09f9e1a3d21c0adb1";
const fakeWithdraw = async () =>
  "0x41d7990d940f8fb6198b2a7b33940bd0526ed17b8695e7e09f9e1a3d21c0adc1";
const fakeDeposit = async () =>
  "0x41d7990d940f8fb6198b2a7b33940bd0526ed17b8695e7e09f9e1a3d21c0ade1";

const sleep = async (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

const WITHDRAW_STEPS = [
  { number: 1, name: "Approve" },
  { number: 2, name: "Withdraw" },
  { number: 3, name: "Finished" },
];

const DEPOSIT_STEPS = [
  {
    number: 1,
    name: "Deposit",
  },
  { number: 2, name: "Finished" },
];

/** INTRO SECTION */
const DashOverviewIntro: React.FC<{
  mode: string;
  onSubmit: (value: BigNumber) => void;
  amount: BigNumber | undefined;
  setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
}> = ({ mode, onSubmit, amount, setAmount }) => {
  return (
    <VStack w="50%">
      <ColoredText fontSize="1.8rem" textTransform="capitalize">
        {mode}
      </ColoredText>
      <Text fontSize="1.4rem">How much do you want to {mode}?</Text>
      <InfoWeiBox
        w="100%"
        mt="3.3rem !important"
        currency="xDAI"
        icon={daiLogo}
        amount={amount}
        setAmount={setAmount}
        mode={mode}
        balance={BigNumber.from(0)}
      />
      <Button
        mt="4.3rem !important"
        disabled={!amount?.gt(0)}
        bg={LINEAR_GRADIENT_BG}
        _hover={{
          background: LINEAR_GRADIENT_BG,
        }}
        color="secondary.900"
        fontSize="1.4rem"
        px="7.5rem"
        py=".8rem"
        onClick={() => onSubmit(amount || BigNumber.from(0))}
      >
        Continue
      </Button>
    </VStack>
  );
};

/** STEPPER CONTROLLER ITEM */
const ControllerItem: React.FC<{
  stepName: string;
  stepDesc: string | null;
  stepNumber: number;
  onActionClick: () => void;
  mode: string;
}> = ({ stepDesc, stepName, onActionClick, mode, stepNumber }) => {
  const STEPS_LENGTH = useMemo(
    () => (mode === "withdraw" ? WITHDRAW_STEPS : DEPOSIT_STEPS).length,
    [mode]
  );

  return (
    <Center w="100%" justifyContent="space-between" p="1.2rem">
      <VStack spacing="0" alignItems="flex-start">
        <Text fontSize="1.3rem" color="yellow.100">
          {stepNumber}/{STEPS_LENGTH} {stepName}
        </Text>
        {stepDesc && <Text fontSize="1rem">{stepDesc}</Text>}
      </VStack>
      <Button
        bg={LINEAR_GRADIENT_BG}
        fontSize="1.2rem"
        textTransform="capitalize"
        color="secondary.900"
        fontWeight="light"
        _hover={{ background: LINEAR_GRADIENT_BG }}
        onClick={onActionClick}
      >
        {stepNumber === STEPS_LENGTH ? "Dashboard" : stepName}
      </Button>
    </Center>
  );
};

/** STEPPER CONTROLLERS */
const WithdrawController: React.FC<{
  onStepInitiate: (txData: TxData) => void;
  onStepComplete: (txHash: string, stepName: string) => void;
  logs: Record<string, TxData>;
  currentStep: number;
}> = ({ currentStep, onStepComplete, onStepInitiate }) => {
  const processTransaction = useCallback(
    async (txHash: string, stepName: string) => {
      const tx: TxData = {
        txHash,
        completedAt: null,
        isComplete: false,
        stepName,
      };
      onStepInitiate(tx);
      await sleep(2000);
      onStepComplete(txHash, stepName);
    },
    [onStepComplete, onStepInitiate]
  );

  // FAKE HANDLERS
  const handleApprove = useCallback(async () => {
    const txHash = await fakeApprove();
    await processTransaction(txHash, "Approve");
  }, [processTransaction]);

  const handleWithdraw = useCallback(async () => {
    const txHash = await fakeWithdraw();
    await processTransaction(txHash, "Withdraw");
  }, [processTransaction]);

  const currentStepElement = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <ControllerItem
            stepNumber={1}
            stepName="Approve"
            stepDesc="Please approve before withdrawal"
            onActionClick={handleApprove}
            mode="withdraw"
          />
        );
      case 2:
        return (
          <ControllerItem
            stepNumber={2}
            stepName="Withdraw"
            stepDesc="Please submit to withdraw"
            onActionClick={handleWithdraw}
            mode="withdraw"
          />
        );
      case 3:
        return (
          <ControllerItem
            stepNumber={3}
            stepName="Success"
            stepDesc={null}
            onActionClick={() => window.location.replace("/#/stake")}
            mode="withdraw"
          />
        );
      default:
        return null;
    }
  }, [currentStep, handleApprove, handleWithdraw]);

  return (
    <>
      <HStack w="100%" spacing="0">
        {WITHDRAW_STEPS.map(step => (
          <Center
            key={step.number}
            flex={1}
            background={
              step.number === currentStep ? LINEAR_GRADIENT_BG : "primary.300"
            }
            color="secondary.900"
            fontSize="1rem"
            padding=".3rem"
          >
            {step.number} {step.name}
          </Center>
        ))}
      </HStack>
      {currentStepElement}
      {}
    </>
  );
};

const DepositController: React.FC<{
  onStepInitiate: (txData: TxData) => void;
  onStepComplete: (txHash: string, stepName: string) => void;
  logs: Record<string, TxData>;
  currentStep: number;
}> = () => {
  return <></>;
};

/** STEPPER MASTER SWITCH */
const DashOverviewStepper: React.FC<{
  amount: BigNumber;
  currentHealthFactor: number;
  nextHealthFactor: number;
  mode: string;
  onModalOpen: () => void;
}> = ({ mode, onModalOpen }) => {
  const [step, changeStep] = useState(1);
  const [stepLogs, setStepLogs] = useState<Record<string, TxData>>(() =>
    JSON.parse(sessionStorage.getItem("stepLogs") || "{}")
  );

  const stepLogsArr = useMemo(() => Object.values(stepLogs), [stepLogs]);

  const handleStepComplete = (txHash: string, stepName: string) => {
    setStepLogs(prevLogs => ({
      ...prevLogs,
      [txHash]: {
        txHash,
        stepName,
        completedAt: new Date(),
        isComplete: true,
      },
    }));

    changeStep(prevStep => prevStep + 1);
  };

  const handleStepInitiate = (txData: TxData) => {
    setStepLogs(prevLogs => ({ ...prevLogs, [txData.txHash]: { ...txData } }));
    sessionStorage.setItem("stepLogs", JSON.stringify(stepLogs));
  };

  useEffect(() => {
    if (
      (mode === "deposit" && step === 2) ||
      (mode === "withdraw" && step === 3)
    ) {
      sessionStorage.removeItem("stepLogs");
    }
  }, [mode, step]);

  return (
    <VStack w="50%" spacing="0">
      <ColoredText
        textTransform="capitalize"
        fontSize="1.8rem"
        mb="1.3rem !important"
      >
        {mode} overview
      </ColoredText>
      <Text fontSize="1.4rem">
        These are your transaction details. Make sure to check if this is
        correct before submitting.
      </Text>
      <VStack
        mt="1.7rem !important"
        spacing=".5rem"
        p="1.5rem"
        w="30rem"
        background="secondary.900"
        rounded="lg"
        alignItems="space-between"
      >
        <HStack justifyContent="space-between">
          <Text lineHeight="1.4rem" fontSize="1rem">
            Amount
          </Text>
          <HStack>
            <Image
              src={daiLogo}
              boxSize={{ base: "1.5rem", md: "1.8rem" }}
              alt="Image left element for WeiBox"
            />
            <Text fontSize="1.2rem">220 xDAI</Text>
          </HStack>
        </HStack>
        <HStack justifyContent="space-between">
          <HStack spacing=".2rem">
            <Text lineHeight="1.4rem" fontSize="1rem">
              Current health factor
            </Text>
            <ModalIcon
              onOpen={onModalOpen}
              position="relative"
              top="0"
              right="0"
              margin="0"
              transform="scale(0.75)"
            />
          </HStack>
          <ColoredText fontSize="1.2rem">5.67</ColoredText>
        </HStack>
        <HStack justifyContent="space-between">
          <Text lineHeight="1.4rem" fontSize="1rem">
            Next health factor
          </Text>
          <ColoredText fontSize="1.2rem">5.11</ColoredText>
        </HStack>
      </VStack>
      <VStack
        w="30rem"
        minH="8rem"
        bg="secondary.900"
        mt="1.4rem !important"
        rounded="lg"
        overflow="hidden"
      >
        {mode === "withdraw" ? (
          <WithdrawController
            onStepComplete={handleStepComplete}
            onStepInitiate={handleStepInitiate}
            logs={stepLogs}
            currentStep={step}
          />
        ) : (
          <DepositController
            onStepComplete={handleStepComplete}
            onStepInitiate={handleStepInitiate}
            logs={stepLogs}
            currentStep={step}
          />
        )}
        {
          /* {stepLogsArr.length > 1 && */
          stepLogsArr.reverse().map(log => {
            return (
              <Center
                w="100%"
                key={log.txHash}
                borderTop="1px solid"
                borderTopColor="yellow.100"
                justifyContent="space-between"
                fontSize="1rem"
                px="1.2rem"
                py=".3rem"
              >
                <Text fontSize="1rem">{log.stepName}</Text>
                {log.isComplete ? (
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
                <HStack
                  as={Link}
                  href={`https://blockscout.com/xdai/mainnet/tx/${log.txHash}`}
                  textDecoration="none !important"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Text fontSize="1rem">Explorer</Text>
                  <Image src={externalLink} boxSize=".8rem" />
                </HStack>
              </Center>
            );
          })
        }
      </VStack>
    </VStack>
  );
};

/** BINDING COMPONENT */
const DashOverview: React.FC<{ mode: string }> = ({ mode }) => {
  const [toggleExecution, setToggleExecution] = useState(false);
  const [amount, setAmount] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  );

  const handleSubmit = (value: BigNumber) => {
    // This log can be deleted later :)
    console.log(value, value.toString());
    setToggleExecution(true);
  };

  return (
    <Center
      p="3rem"
      flex={1}
      background="primary.900"
      w="100%"
      rounded="lg"
      position="relative"
    >
      <Button
        background="transparent"
        border="1px solid white"
        fontWeight="light"
        fontSize="1.2rem"
        px="1.8rem"
        py=".5rem"
        position="absolute"
        top="3rem"
        left="3rem"
        onClick={() => setToggleExecution(false)}
      >
        Back
      </Button>
      {!toggleExecution ? (
        <DashOverviewIntro
          mode={mode}
          onSubmit={handleSubmit}
          amount={amount}
          setAmount={setAmount}
        />
      ) : (
        amount && (
          <DashOverviewStepper
            amount={amount}
            currentHealthFactor={5.67}
            nextHealthFactor={5.11}
            mode={mode}
            onModalOpen={() => {}}
          />
        )
      )}
    </Center>
  );
};

export default DashOverview;
