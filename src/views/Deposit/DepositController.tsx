import { HStack, Center } from "@chakra-ui/react";
import React, { useCallback, useMemo } from "react";
import { ControllerItem } from "../../components/ControllerItem";
import { LINEAR_GRADIENT_BG } from "../../utils/constants";
import { sleep } from "../../utils/helpers";
import { TxData } from "../../utils/types";

const fakeDeposit = async () =>
  "0x41d7990d940f8fb6198b2a7b33940bd0526ed17b8695e7e09f9e1a3d21c0ade1";

const DEPOSIT_STEPS = [
  {
    name: "Deposit",
  },
  { name: "Finished" },
];

export const DepositController: React.FC<{
  onStepInitiate: (txData: TxData) => void;
  onStepComplete: (txHash: string, stepName: string) => void;
  currentStep: number;
}> = ({ currentStep, onStepComplete, onStepInitiate }) => {
  // This is mimicing the delay.
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

  const handleDeposit = useCallback(async () => {
    const txHash = await fakeDeposit();
    await processTransaction(txHash, "Deposit");
  }, [processTransaction]);

  const currentStepElement = useMemo(() => {
    switch (currentStep) {
      case 1:
        return (
          <ControllerItem
            stepNumber={1}
            stepName="Deposit"
            stepDesc="Please submit to deposit"
            onActionClick={handleDeposit}
            totalSteps={2}
          />
        );
      case 2:
        return (
          <ControllerItem
            stepNumber={2}
            stepName="Success"
            stepDesc={null}
            onActionClick={() => window.location.replace("/#/stake")}
            totalSteps={2}
          />
        );
      default:
        return null;
    }
  }, [currentStep, handleDeposit]);

  return (
    <>
      <HStack w="100%" spacing="0">
        {DEPOSIT_STEPS.map((step, index) => (
          <Center
            key={index + 1}
            flex={1}
            background={
              index + 1 === currentStep ? LINEAR_GRADIENT_BG : "primary.300"
            }
            color="secondary.900"
            fontSize="1rem"
            padding=".3rem"
          >
            {index + 1} {step.name}
          </Center>
        ))}
      </HStack>
      {currentStepElement}
    </>
  );
};
