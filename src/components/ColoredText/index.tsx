import { Text, TextProps } from "@chakra-ui/layout";

const ColoredText: React.FC<TextProps> = ({ children, ...props }) => {
  return (
    <Text
      color="white"
      fontSize={{ base: "2rem", md: "2.4rem" }}
      fontWeight="bold"
      bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
      backgroundClip="text"
      {...props}
    >
      {children}
    </Text>
  );
};

export default ColoredText;
