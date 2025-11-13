import {Flex, Button, Box, Text} from "@chakra-ui/react";
import React from "react";
import {useForm} from "react-hook-form";

const RatingPage = () => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

  return (
    <>
      <Box>
        <Box>
          <Text>Review your carrier certifications</Text>
          <Text>
            Enter the code we just sent to the mobile number you entered.
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default RatingPage;
