import React from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  VStack,
  Text,
  Select as ChakraSelect,
} from "@chakra-ui/react";
import { useTimezone } from "../hooks/useTimezone";
import { TIMEZONE_OPTIONS } from "../utils/timezones";
import HFDateTimePicker from "./HFDateTimePicker";

/**
 * Example component demonstrating timezone usage
 */
function TimezoneExample() {
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      pickup_date: null,
      delivery_date: null,
    },
  });

  const {
    timezone,
    setTimezone,
    userTimezone,
    toUTC,
    formatAsDateTime,
    formatAsShortDate,
    formatAsTime,
  } = useTimezone();

  const watchedPickupDate = watch("pickup_date");
  const watchedDeliveryDate = watch("delivery_date");

  const onSubmit = (data) => {
    console.log("=== Form Submission ===");
    console.log("Raw form data:", data);

    // Convert local dates to UTC for API
    const apiPayload = {
      pickup_date: data.pickup_date
        ? toUTC(data.pickup_date)?.toISOString()
        : null,
      delivery_date: data.delivery_date
        ? toUTC(data.delivery_date)?.toISOString()
        : null,
    };

    console.log("API Payload (UTC):", apiPayload);
    console.log("===================");

    // Here you would send apiPayload to your API
    // Example: await tripsService.createTrip(apiPayload);
  };

  // Example: Display UTC date from API in user's timezone
  const exampleApiDate = "2024-01-15T20:30:00Z";

  return (
    <Box
      p="24px"
      maxW="800px"
      mx="auto">
      <Text
        fontSize="24px"
        fontWeight="600"
        mb="24px">
        Timezone Management Example
      </Text>

      {/* Timezone Info */}
      <Box
        mb="24px"
        p="16px"
        bg="blue.50"
        borderRadius="8px">
        <Text
          fontSize="14px"
          mb="8px">
          <strong>Current Timezone:</strong> {timezone}
        </Text>
        <Text
          fontSize="14px"
          mb="8px">
          <strong>Browser Timezone:</strong> {userTimezone}
        </Text>
        <Text
          fontSize="14px"
          color="gray.600">
          All dates are converted to UTC before sending to the API
        </Text>
      </Box>

      {/* Timezone Selector */}
      <Box mb="24px">
        <Text
          mb="6px"
          fontSize="14px"
          fontWeight="500"
          color="#414651">
          Select Timezone
        </Text>
        <ChakraSelect
          value={timezone}
          onChange={(e) => setTimezone(e.target.value)}
          border="1px solid #D5D7DA"
          borderRadius="8px">
          {TIMEZONE_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}>
              {option.label}
            </option>
          ))}
        </ChakraSelect>
      </Box>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack
          spacing="24px"
          align="stretch">
          {/* Pickup Date */}
          <Box>
            <HFDateTimePicker
              control={control}
              name="pickup_date"
              label="Pickup Date & Time"
              placeholder="Select pickup date and time"
              required
            />
            {watchedPickupDate && (
              <Box
                mt="8px"
                p="12px"
                bg="green.50"
                borderRadius="8px">
                <Text
                  fontSize="12px"
                  color="green.700">
                  <strong>Selected (Local):</strong>{" "}
                  {watchedPickupDate.toString()}
                </Text>
                <Text
                  fontSize="12px"
                  color="green.700">
                  <strong>Will be sent as (UTC):</strong>{" "}
                  {toUTC(watchedPickupDate)?.toISOString()}
                </Text>
              </Box>
            )}
          </Box>

          {/* Delivery Date */}
          <Box>
            <HFDateTimePicker
              control={control}
              name="delivery_date"
              label="Delivery Date & Time"
              placeholder="Select delivery date and time"
              minDate={watchedPickupDate || new Date()}
              required
            />
            {watchedDeliveryDate && (
              <Box
                mt="8px"
                p="12px"
                bg="green.50"
                borderRadius="8px">
                <Text
                  fontSize="12px"
                  color="green.700">
                  <strong>Selected (Local):</strong>{" "}
                  {watchedDeliveryDate.toString()}
                </Text>
                <Text
                  fontSize="12px"
                  color="green.700">
                  <strong>Will be sent as (UTC):</strong>{" "}
                  {toUTC(watchedDeliveryDate)?.toISOString()}
                </Text>
              </Box>
            )}
          </Box>

          {/* Example: Display API date */}
          <Box
            p="16px"
            bg="purple.50"
            borderRadius="8px">
            <Text
              fontSize="14px"
              fontWeight="600"
              mb="8px">
              Example: Display UTC date from API
            </Text>
            <Text
              fontSize="12px"
              color="gray.600"
              mb="8px">
              API Date (UTC): <code>{exampleApiDate}</code>
            </Text>
            <VStack
              align="start"
              spacing="4px">
              <Text fontSize="12px">
                <strong>Full DateTime:</strong>{" "}
                {formatAsDateTime(exampleApiDate)}
              </Text>
              <Text fontSize="12px">
                <strong>Date Only:</strong> {formatAsShortDate(exampleApiDate)}
              </Text>
              <Text fontSize="12px">
                <strong>Time Only:</strong> {formatAsTime(exampleApiDate)}
              </Text>
            </VStack>
          </Box>

          {/* Submit Button */}
          <Button
            type="submit"
            bg="#FF6B35"
            color="white"
            _hover={{ bg: "#E55A2B" }}
            h="40px">
            Submit (Check Console)
          </Button>
        </VStack>
      </form>

      {/* Instructions */}
      <Box
        mt="24px"
        p="16px"
        bg="gray.50"
        borderRadius="8px">
        <Text
          fontSize="14px"
          fontWeight="600"
          mb="8px">
          How it works:
        </Text>
        <VStack
          align="start"
          spacing="4px"
          fontSize="12px"
          color="gray.700">
          <Text>
            1. Select dates in the date pickers (in your local timezone)
          </Text>
          <Text>2. The component automatically converts them to UTC</Text>
          <Text>
            3. Click Submit and check the browser console to see the UTC
            conversion
          </Text>
          <Text>4. Change timezone to see how display formatting changes</Text>
          <Text>
            5. API dates are always stored as UTC and converted for display
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}

export default TimezoneExample;
