import React from "react";
import {
  VStack,
  Flex,
  Text,
  StackProps,
  useMediaQuery,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  IconButton,
  Stack,
  Input,
  PopoverArrow,
  keyframes,
  useColorModeValue,
  PopoverBody,
} from "@chakra-ui/react";
import { BigNumber, FixedNumber } from "ethers";
import { WeiBox } from "../../components/Actions/WeiBox";
import { fontSizes } from "../../utils/constants";
import { TokenIcon } from "../../utils/icons";
import { SettingsIcon } from "@chakra-ui/icons";
import {
  bigNumberToString,
  fixedNumberToPercentage,
} from "../../utils/fixedPoint";
import { ColoredText } from "../../components/ColoredText";

const animationKeyframes = keyframes`
  100% { transform: scale(1) rotate(360deg) }
`;

const animation = `${animationKeyframes} 2s ease-in-out infinite`;

const HealthFactorInput: React.FC<
  {
    healthFactor?: BigNumber | undefined;
    setMinSafeHF?: React.Dispatch<React.SetStateAction<BigNumber>>;
  } & StackProps
> = ({ healthFactor, setMinSafeHF, ...props }) => {
  // TODO: Make this never be less than 1001
  const handleChange = (event: any) => {
    const value = Math.ceil(parseFloat(event.target.value) * 1000);
    setMinSafeHF?.(BigNumber.from(value ? value : 1000));
  };
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <Popover>
      <PopoverTrigger>
        <IconButton
          size="sm"
          variant="ghost"
          colorScheme="white"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          icon={<SettingsIcon animation={isHovered ? animation : ""} />}
          aria-label={""}
        />
      </PopoverTrigger>
      <PopoverContent
        bg={useColorModeValue(
          { base: "primary.900", md: "primary.900" },
          "primary.900"
        )}
        color="white"
        borderColor={useColorModeValue(
          { base: "primary.50", md: "primary.50" },
          "primary.50"
        )}
      >
        <PopoverArrow
          bg="#007c6e"
          color="white"
          border="0px"
          boxShadow="-1px -1px 1px 0px #36cfa2 !important"
          borderColor={useColorModeValue(
            { base: "primary.50", md: "primary.50" },
            "primary.50"
          )}
        />
        <Stack spacing={4}>
          <PopoverBody>
            <Text fontWeight="semibold" fontSize={fontSizes.sm}>
              Minimum Safe Health Factor
            </Text>
            <Input
              background="secondary.900"
              border={`0px`}
              type="number"
              min="1.000"
              max="10000000000"
              defaultValue="1.200"
              step="0.001"
              onChange={handleChange}
              fontWeight="semibold"
            />
          </PopoverBody>
        </Stack>
      </PopoverContent>
    </Popover>
  );
};
const InfoWeiBox: React.FC<
  {
    currency: string;
    mode: "repay" | "deposit" | "withdraw" | "borrow" | "stake";
    balance: BigNumber | undefined;
    healthFactor?: BigNumber | undefined;
    amount: BigNumber | undefined;
    decimals: number;
    setAmount: React.Dispatch<React.SetStateAction<BigNumber | undefined>>;
    setMinSafeHF?: React.Dispatch<React.SetStateAction<BigNumber>>;
  } & StackProps
> = ({
  mode,
  balance,
  currency,
  healthFactor,
  amount,
  decimals,
  setAmount,
  setMinSafeHF,
  ...props
}) => {
  const [isSmallerThan768] = useMediaQuery("(max-width: 765px)");
  return (
    <VStack fontSize="1.5rem" {...props}>
      <Flex
        w="100%"
        justifyContent="space-between"
        fontSize={{ base: fontSizes.md, md: "inherit" }}
      >
        <Text color="white" fontSize="inherit">
          Available to {mode}
        </Text>
        <Text color="white" fontSize="inherit" textTransform="capitalize">
          {balance &&
            FixedNumber.fromValue(balance, decimals)
              .toString()
              .slice(0, decimals)}{" "}
          {currency}
        </Text>
      </Flex>

      <WeiBox
        amount={amount}
        decimals={decimals}
        setAmount={setAmount}
        icon={isSmallerThan768 ? null : <TokenIcon symbol={currency} />}
        maxAmount={balance}
      />

      {healthFactor ? (
        <HStack>
          <Text color="white" fontSize="inherit">
            Health Factor
          </Text>
          <ColoredText
            color="white"
            fontSize="inherit"
            textTransform="capitalize"
          >
            {bigNumberToString(healthFactor, 2, 3)}
          </ColoredText>
          <HealthFactorInput
            healthFactor={healthFactor}
            setMinSafeHF={setMinSafeHF}
          />
        </HStack>
      ) : null}
    </VStack>
  );
};

export default InfoWeiBox;
