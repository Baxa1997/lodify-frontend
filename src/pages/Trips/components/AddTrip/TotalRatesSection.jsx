import React from "react";
import {Box, Text, Divider, Flex} from "@chakra-ui/react";
import {Controller} from "react-hook-form";

const TotalRatesSection = ({watch, control}) => {
  const totalRates = watch("accessorials");

  const getTotalAmount = () => {
    return totalRates?.length > 0
      ? totalRates?.reduce((total, field) => total + (field.amount || 0), 0)
      : 0;
  };


  return (
    <Box
      display="grid"
      gridTemplateColumns="1fr 1fr"
      gap="20px"
      borderRadius="12px"
      p="20px"
      border="1px solid"
      borderColor="#E9EAEB">
      <Box>
        <Controller
          name="total_rates"
          control={control}
          render={({field}) => (
            <Box bg="white" w="100%">
              <Text fontSize="14px" fontWeight="500" color="#717680" mb="12px">
                Total Rates
              </Text>

              <Divider borderColor="#E9EAEB" mb="12px" />

              <Text fontSize="20px" fontWeight="700" color="#181D27">
                ${getTotalAmount() + (watch("service_fee") ?? 0)}
              </Text>
            </Box>
          )}
        />
      </Box>

      <Box borderLeft="1px solid #E9EAEB" pl="20px">
        <Controller
          name="total_miles"
          control={control}
          render={({field}) => (
            <Box bg="white">
              <Text fontSize="14px" fontWeight="500" color="#717680" mb="12px">
                Total Miles
              </Text>

              <Divider borderColor="#E9EAEB" mb="12px" />

              <Text fontSize="20px" fontWeight="700" color="#181D27">
                {watch("total_miles")?.toFixed(2) || 0} mi
              </Text>
            </Box>
          )}
        />
      </Box>
    </Box>
  );
};

export default TotalRatesSection;
