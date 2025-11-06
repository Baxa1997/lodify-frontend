import React, { useEffect } from "react";
import { Box, Text } from "@chakra-ui/react";
import InputFormField from "../InputFormField";
import styles from "../../MultiStepRegister.module.scss";

const ContactDetails = ({ control, errors, setValue, onNext = () => {} }) => {
  useEffect(() => {
    onNext();
  }, []);

  return (
    <Box className={styles.stepContent}>
      {/* <InputFormField
        type="email"
        label="Email Address"
        name="email"
        placeholder="Enter email address"
        register={register}
        errors={errors}
        disabled
        isRequired
        validation={{
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Please enter a valid email address",
          },
        }}
      />

      <InputFormField
        label="Login"
        name="login"
        placeholder="Create a login"
        register={register}
        errors={errors}
        isRequired
        validation={{
          required: "Login is required",
          minLength: {
            value: 3,
            message: "Login must be at least 3 characters",
          },
        }}
      />

      <InputFormField
        type="password"
        label="Password"
        name="password"
        placeholder="Create a password"
        register={register}
        errors={errors}
        isRequired
        validation={{
          required: "Password is required",
          minLength: {
            value: 8,
            message: "Password must be at least 8 characters",
          },
        }}
      /> */}
    </Box>
  );
};

export default ContactDetails;
