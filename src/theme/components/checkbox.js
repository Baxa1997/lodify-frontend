import { checkboxAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers, defineStyle } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(checkboxAnatomy.keys);

const baseStyle = definePartsStyle({
  control: {
    width: "20px",
    height: "20px",
    padding: "3px",
    borderRadius: "6px",
    border: "1px solid #D5D7DA",
    _checked: {
      backgroundColor: "#1570EF",
    },
  },
  icon: {
    color: "#fff",
  },
});

const sizes = {
  xl: definePartsStyle({
    control: defineStyle({
      boxSize: 14,
    }),
    label: defineStyle({
      fontSize: "2xl",
      marginLeft: 6,
    }),
  }),
};

export const checkboxTheme = defineMultiStyleConfig({ baseStyle, sizes });