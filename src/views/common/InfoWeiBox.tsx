import { VStack, Flex, Text, StackProps } from "@chakra-ui/react";
import { BigNumber, FixedNumber } from "ethers";
import React from "react";
import { WeiBox } from "../../components/Actions/WeiBox";

const InfoWeiBox: React.FC<
  {
    mode: string;
    balance: BigNumber | undefined;
    currency: string;
    icon: string;
    amount: BigNumber | undefined;
    setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
  } & StackProps
> = ({ mode, balance, currency, icon, amount, setAmount, ...props }) => {
  return (
    <VStack fontSize="1.5rem" {...props}>
      <Flex
        w="100%"
        justifyContent="space-between"
        fontSize={{ base: "1.4rem", md: "inherit" }}
      >
        <Text color="white" fontSize="inherit">
          Available to {mode}
        </Text>
        <Text color="white" fontSize="inherit" textTransform="capitalize">
          {balance && FixedNumber.fromValue(balance, 18).toString()} {currency}
        </Text>
      </Flex>
      <WeiBox
        amount={amount}
        decimals={18}
        setAmount={setAmount}
        icon={icon}
        maxAmount={balance}
      />
    </VStack>
  );
};

export default InfoWeiBox;
