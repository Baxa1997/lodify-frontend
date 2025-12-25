import React from "react";
import {
  Box,
  Text,
  RadioGroup,
  Radio,
  Stack,
  Flex,
  Button,
} from "@chakra-ui/react";
import {Controller} from "react-hook-form";

const GetPaid = ({control}) => {
  const paymentOptions = [
    {
      value: "quickpay",
      title: "QuickPay- 2",
      details: "2 Days, 3% Free",
      showAch: true,
      showInfo: true,
    },
    {
      value: "standard",
      title: "Standard Pay",
      details: "30 Days, 0% Free",
      showAch: true,
      showInfo: false,
    },
    {
      value: "factoring",
      title: "Factoring",
      details: "",
      showAch: false,
      showInfo: false,
    },
  ];

  return (
    <Box>
      <Text fontSize="20px" fontWeight="bold" color="#1e293b" mb="8px">
        How do you want to get paid?
      </Text>
      <Text fontSize="16px" color="#414651" mb="20px">
        Enter the code we just sent to the mobile number you entered.
      </Text>

      <Controller
        control={control}
        name="payment_method"
        defaultValue="factoring"
        render={({field}) => (
          <RadioGroup {...field}>
            <Stack spacing="12px">
              {paymentOptions.map((option) => {
                const isSelected = field.value === option.value;
                return (
                  <Box
                    key={option.value}
                    as="label"
                    cursor="pointer"
                    p="9px"
                    bg="#FAFAFA"
                    height="70px"
                    borderRadius="8px"
                    border="2px solid"
                    borderColor={isSelected ? "#FF5B04" : "#E2E8F0"}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: isSelected ? "#FF5B04" : "#D5D7DA",
                    }}>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      height="100%">
                      <Flex alignItems="center" gap="12px" flex="1">
                        <Radio
                          size="lg"
                          //   width="28px"
                          //   height="28px"
                          value={option.value}
                          colorScheme="orange"
                          border="1px solid #D5D7DA"
                          isChecked={isSelected}
                        />
                        <Box>
                          <Text
                            fontSize="16px"
                            fontWeight="600"
                            color="#414651">
                            {option.title}
                          </Text>
                          {option.details && (
                            <Text fontSize="14px" color="#535862">
                              {option.details}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                      <Flex alignItems="center" gap="8px">
                        {option.showAch && (
                          <Button
                            size="sm"
                            variant="outline"
                            borderColor="#E2E8F0"
                            color="#414651"
                            fontSize="12px"
                            fontWeight="500"
                            px="12px"
                            py="4px"
                            height="auto"
                            borderRadius="6px"
                            bg="#fff"
                            _hover={{bg: "#E9EAEB"}}>
                            ACH
                          </Button>
                        )}
                        {option.showInfo && (
                          <Box
                            as="button"
                            width="20px"
                            height="20px"
                            borderRadius="50%"
                            border="1px solid #D5D7DA"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            bg="white"
                            cursor="pointer"
                            _hover={{bg: "#F8F9FA"}}>
                            <img
                              src="/img/info.svg"
                              alt="info"
                              width="12px"
                              height="12px"
                            />
                          </Box>
                        )}
                      </Flex>
                    </Flex>
                  </Box>
                );
              })}
            </Stack>
          </RadioGroup>
        )}
      />
    </Box>
  );
};

export default GetPaid;
