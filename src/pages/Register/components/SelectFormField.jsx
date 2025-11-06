import React from "react";
import { Box, Select, Text } from "@chakra-ui/react";
import styles from "../MultiStepRegister.module.scss";

const SelectFormField = ({
  label,
  name,
  placeholder,
  register,
  errors,
  validation = {},
  isRequired = false,
  options = [],
  children,
  ...selectProps
}) => {
  return (
    <Box className={styles.formGroup}>
      <Text
        as="label"
        htmlFor={name}
        className={styles.formLabel}>
        {label} <span>{isRequired && "*"}</span>
      </Text>

      <Select
        id={name}
        name={name}
        placeholder={placeholder}
        {...register(name, validation)}
        isInvalid={!!errors[name]}
        errorBorderColor="#e53e3e"
        className={styles.formInput}
        sx={{
          width: "100%",
          padding: "12px 16px",
          border: "2px solid #e2e8f0",
          borderRadius: "8px",
          fontSize: "16px",
          transition: "all 0.2s ease",
          background: "white",
          maxHeight: "200px",
          _focus: {
            outline: "none",
            borderColor: "#3b82f6",
            boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
          },
        }}
        {...selectProps}>
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>

      {children}
    </Box>
  );
};

export default SelectFormField;
