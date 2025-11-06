import React from "react";
import { Box, Input, Text, Select } from "@chakra-ui/react";
import styles from "../MultiStepRegister.module.scss";

const FormField = ({
  label,
  name,
  type = "text",
  placeholder,
  register,
  errors,
  validation = {},
  isRequired = false,
  hasDropdown = false,
  options = [],
  children,
  ...inputProps
}) => {
  return (
    <Box className={styles.formGroup}>
      <Text
        as="label"
        htmlFor={name}
        className={styles.formLabel}>
        {label} <span>{isRequired && "*"}</span>
      </Text>

      {hasDropdown ? (
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
          {...inputProps}>
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      ) : (
        <Input
          type={type}
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
            _focus: {
              outline: "none",
              borderColor: "#3b82f6",
              boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
            },
          }}
          {...inputProps}
        />
      )}

      {errors[name] && (
        <Text
          color="red.500"
          fontSize="sm"
          mt={1}>
          {errors[name].message}
        </Text>
      )}

      {children}
    </Box>
  );
};

export default FormField;
