import { extendTheme } from "@chakra-ui/react";
import { colors } from "./colors";
import { checkboxTheme } from "./components/checkbox";

const theme = extendTheme({
  colors,
  components: {
    Checkbox: checkboxTheme,
  },
});

export default theme;
