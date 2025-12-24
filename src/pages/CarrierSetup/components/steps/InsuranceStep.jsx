import React from "react";
import {Box, Text, RadioGroup, Radio, Stack, Flex} from "@chakra-ui/react";
import styles from "../../CarrierSetup.module.scss";
import HFMultiSelect from "@components/HFMultiSelect";
import HFTextField from "@components/HFTextField";
import HFFileUpload from "@components/HFFileUpload";
import HFDatePicker from "@components/HFDatePicker";
import HFPhoneInput from "@components/HFPhoneInput";
import {Controller} from "react-hook-form";

const InsuranceStep = ({control, subView = 1}) => {
  const commodityTypes = [
    {label: "Agriculture", value: "agriculture"},
    {label: "Alcohol", value: "alcohol"},
    {label: "Automotive", value: "automotive"},
    {label: "Chemicals", value: "chemicals"},
    {label: "Electronics", value: "electronics"},
    {label: "Food", value: "food"},
  ];

  if (subView === 2) {
    return (
      <Box className={styles.stepContentInsuranceWorkersComp}>
        <Text
          fontSize="24px"
          fontWeight="bold"
          color="#1e293b"
          mb="8px"
          maxWidth="300px">
          Worker&apos;s compensation
        </Text>
        <Text fontSize="14px" color="#414651" mb="20px">
          Confirm whether your company is required to carry Workers&apos;
          Compensation Insurance.
        </Text>

        <Controller
          control={control}
          name="workers_comp_required"
          defaultValue="yes"
          render={({field}) => (
            <RadioGroup {...field} mb="24px">
              <Stack direction="row" spacing="24px">
                <Radio value="yes" colorScheme="orange">
                  <Text fontSize="14px" color="#414651">
                    Yes
                  </Text>
                </Radio>
                <Radio value="no" colorScheme="orange">
                  <Text fontSize="14px" color="#414651">
                    No
                  </Text>
                </Radio>
              </Stack>
            </RadioGroup>
          )}
        />

        <Flex
          border="1px solid #D5D7DA"
          mb="24px"
          p="10px"
          justifyContent="space-between"
          borderRadius="10px">
          <Box>
            <Text
              fontSize="16px"
              fontWeight="600"
              color="#1e293b"
              maxWidth="200px">
              Worker&apos;s compensation insurance
            </Text>
            <Text fontSize="14px" color="#414651">
              Upload Document
            </Text>
          </Box>
          <Flex>
            <HFFileUpload
              control={control}
              name="workers_comp_document"
              label=""
            />
          </Flex>
        </Flex>

        <Box display="flex" flexDirection="column" gap="16px">
          <HFTextField
            control={control}
            name="workers_comp_policy_number"
            label="Policy number"
            placeholder="Enter policy number"
            required
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Effective date
              <Box as="span" color="blue.500">
                *
              </Box>
            </Text>
            <Box
              sx={{
                "& input": {
                  border: "1px solid #D5D7DA",
                  borderRadius: "8px",
                  height: "40px",
                  fontSize: "14px",
                },
              }}>
              <HFDatePicker
                control={control}
                name="workers_comp_effective_date"
              />
            </Box>
          </Box>

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Cancellation date
              <Box as="span" color="blue.500">
                *
              </Box>
            </Text>
            <Box
              sx={{
                "& input": {
                  border: "1px solid #D5D7DA",
                  borderRadius: "8px",
                  height: "40px",
                  fontSize: "14px",
                },
              }}>
              <HFDatePicker
                control={control}
                name="workers_comp_cancellation_date"
              />
            </Box>
          </Box>

          <HFTextField
            control={control}
            name="workers_comp_issued_by"
            label="Issued by"
            placeholder="Enter issuer name"
            required
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <HFTextField
            control={control}
            name="workers_comp_full_name"
            label="Full name"
            placeholder="Enter full name"
            required
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />

          <Box>
            <Text
              as="label"
              fontSize="14px"
              fontWeight="500"
              color="#414651"
              mb="6px"
              display="block">
              Phone number
              <Box as="span" color="blue.500">
                *
              </Box>
            </Text>
            <HFPhoneInput control={control} name="workers_comp_phone" />
          </Box>

          <HFTextField
            control={control}
            name="workers_comp_email"
            label="Email"
            placeholder="Enter email address"
            type="email"
            required
            style={{
              border: "1px solid #D5D7DA",
            }}
            labelStyle={{
              fontSize: "14px",
              fontWeight: "500",
              color: "#414651",
            }}
          />
        </Box>
      </Box>
    );
  }

  return (
    <Box className={styles.stepContentInsurance}>
      <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
        Cargo Insurance
      </Text>
      <Text fontSize="14px" color="#414651" mb="12px">
        Please confirm your policy exclusions below{" "}
      </Text>

      <Box>
        <Text fontSize="14px" fontWeight="600" color="#414651" mb="8px">
          Commodity type
        </Text>
        <HFMultiSelect
          options={commodityTypes}
          control={control}
          name="commodity_types"
          label="Commodity type"
        />
      </Box>
    </Box>
  );
};

export default InsuranceStep;
