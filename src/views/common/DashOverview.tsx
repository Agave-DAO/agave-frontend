import { Center, Text, VStack } from "@chakra-ui/layout";
import { useState } from "react";
import ColoredText from "../../components/ColoredText";
import daiLogo from "../../assets/image/coins/dai.svg";
import InfoWeiBox from "./InfoWeiBox";
import { BigNumber } from "ethers";
import { Button } from "@chakra-ui/button";

const bg = "linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%)";

const DashOverviewIntro: React.FC<{ mode: string }> = ({ mode }) => {
  const [amount, setAmount] = useState<BigNumber | undefined>(
    BigNumber.from(0)
  );

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
    </VStack>
  );
};

const DashOverview: React.FC<{ mode: string }> = ({ mode }) => {
  const [toggleExecution, setToggleExecution] = useState(false);

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
      >
        Back
      </Button>
      {!toggleExecution ? <DashOverviewIntro mode={mode} /> : null}
    </Center>
  );
};

export default DashOverview;
