import React from "react";
import { useForm } from "react-hook-form";
import { Box, Button, VStack } from "@chakra-ui/react";
import HFDateTimePicker from "./HFDateTimePicker";

// Example usage component
function HFDateTimePickerExample() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      pickup_date: null,
      delivery_date: null,
    },
  });

  const onSubmit = (data) => {
    console.log("Form data:", data);
  };

  return (
    <Box p="24px">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          spacing="24px"
          align="stretch">
          {/* Basic DateTimePicker */}
          <HFDateTimePicker
            control={control}
            name="pickup_date"
            label="Pickup Date & Time"
            placeholder="Select pickup date and time"
            required
          />

          {/* DateTimePicker with custom format */}
          <HFDateTimePicker
            control={control}
            name="delivery_date"
            label="Delivery Date & Time"
            placeholder="Select delivery date and time"
            valueFormat="YYYY-MM-DD HH:mm"
            required
          />

          {/* DateTimePicker with min/max dates */}
          <HFDateTimePicker
            control={control}
            name="appointment_date"
            label="Appointment Date & Time"
            placeholder="Select appointment"
            minDate={new Date()}
            maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)} // 30 days from now
            clearable={false}
          />

          <Button
            type="submit"
            bg="#FF6B35"
            color="white"
            _hover={{ bg: "#E55A2B" }}>
            Submit
          </Button>
        </VStack>
      </form>
    </Box>
  );
}

export default HFDateTimePickerExample;
