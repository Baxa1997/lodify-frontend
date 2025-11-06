import { Box, Input, InputGroup, InputLeftAddon } from "@chakra-ui/react";
import { Controller } from "react-hook-form";

const HFMeasureInput = ({
  control,
  name,
  label,
  placeholder,
  type = "text",
  required,
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
            <InputLeftAddon bgColor="transparent">{field.value}</InputLeftAddon>
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
          </InputGroup>
        </Box>
      )}
    />
  );
};

export default HFMeasureInput;
