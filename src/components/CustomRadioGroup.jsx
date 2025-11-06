import React from "react";
import { Box } from "@chakra-ui/react";

// Custom RadioGroup Component
const CustomRadioGroup = ({ value, onChange, children, name, ...props }) => {
  const handleChange = (event) => {
    if (onChange) {
      onChange(event.target.value);
    }
  };

  return (
    <Box {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            name,
            checked: value === child.props.value,
            onChange: handleChange,
          });
        }
        return child;
      })}
    </Box>
  );
};

export default CustomRadioGroup;
