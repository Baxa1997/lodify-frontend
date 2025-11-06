import {
  Box,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";

const HFTextField = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required,
  leftAddon,
  rightAddon,
  leftElement,
  rightElement,
  ...props
}) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Box width="100%">
          {label && (
            <Box
              as="label"
              color="#414651"
              fontWeight={500}
              mb="6px"
              display="block"
              htmlFor={name}>
              {label}
              {required && (
                <Box
                  as="span"
                  color="blue.500">
                  *
                </Box>
              )}
            </Box>
          )}
          <InputGroup>
            {leftAddon && (
              <InputLeftAddon bgColor="transparent">{leftAddon}</InputLeftAddon>
            )}
            {leftElement && <InputLeftElement>{leftElement}</InputLeftElement>}
            <Input
              type={type}
              {...field}
              label={label}
              placeholder={placeholder}
              px={"12px"}
              py={"8px"}
              borderRadius="8px"
              id={name}
              _disabled={{
                bg: "gray.bg.disabled",
                color: "gray.color.disabled",
              }}
              {...props}
            />
            {rightAddon && <InputRightAddon>{rightAddon}</InputRightAddon>}
            {rightElement && (
              <InputRightElement>{rightElement}</InputRightElement>
            )}
          </InputGroup>
        </Box>
      )}
    />
  );
};

export default HFTextField;
