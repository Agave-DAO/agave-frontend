import { Text, TextProps } from "@chakra-ui/layout";
import { fontSizes } from "../../utils/constants";

export const ColoredText: React.FC<TextProps> = props => {
  return (
    <Text
      color="white"
      fontSize={{ base: fontSizes.sm, md: fontSizes.md }}
      fontWeight="bold"
      bg="linear-gradient(90.53deg, #9BEFD7 0%, #8BF7AB 47.4%, #FFD465 100%);"
      backgroundClip="text"
      {...props}
    />
  );
};

export default ColoredText;
