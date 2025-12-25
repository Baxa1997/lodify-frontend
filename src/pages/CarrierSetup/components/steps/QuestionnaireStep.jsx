import React, {useRef} from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  RadioGroup,
  Radio,
  Stack,
} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import styles from "../../CarrierSetup.module.scss";
import HFSelect from "@components/HFSelect";

const QuestionnaireStep = ({control}) => {
  const fileInputRef1 = useRef(null);
  const fileInputRef2 = useRef(null);

  const handleUploadClick = (ref) => {
    ref.current?.click();
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      console.log(`File selected for section ${index}:`, file);
    }
  };

  const QuestionSection = ({index, control}) => {
    const fileRef = index === 1 ? fileInputRef1 : fileInputRef2;
    return (
      <Box className={styles.questionSection} mb="10px">
        <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="16px">
          Is your entity a Women Owned Business? (Required)
        </Text>

        <Controller
          control={control}
          name={`women_owned_business_${index}`}
          defaultValue={index === 1 ? "no" : "yes"}
          render={({field}) => (
            <RadioGroup {...field} mb="10px">
              <Box
                display="grid"
                gridTemplateColumns="repeat(2, 1fr)"
                gap="12px">
                <Flex
                  border="1px solid #D5D7DA"
                  borderRadius="8px"
                  bg="#FAFAFA"
                  p="10px 12px">
                  <Radio
                    border="1px solid #D5D7DA"
                    value="yes"
                    colorScheme="blue">
                    <Text fontSize="14px" color="#414651">
                      Yes
                    </Text>
                  </Radio>
                </Flex>

                <Flex
                  bg="#FAFAFA"
                  border="1px solid #D5D7DA"
                  borderRadius="8px"
                  p="10px 12px">
                  <Radio
                    border="1px solid #D5D7DA"
                    value="no"
                    colorScheme="blue">
                    <Text fontSize="14px" color="#414651">
                      No
                    </Text>
                  </Radio>
                </Flex>
              </Box>
            </RadioGroup>
          )}
        />

        <Box mb="16px">
          <HFSelect
            control={control}
            name={`questionnaire_select_${index}`}
            options={[
              {label: "Option 1", value: "option1"},
              {label: "Option 2", value: "option2"},
              {label: "Option 3", value: "option3"},
            ]}
            placeholder="Select"
            size="md"
          />
        </Box>

        <Flex
          border="1px solid #D5D7DA"
          borderRadius="12px"
          p="12px"
          bg="#fff"
          justifyContent="space-between"
          alignItems="center">
          <Box>
            <Text fontSize="16px" fontWeight="600" color="#1e293b">
              Title
            </Text>
            <Text fontSize="14px" color="#414651">
              Upload Document
            </Text>
          </Box>
          <Button
            height="40px"
            variant="outline"
            borderColor="#D5D7DA"
            color="#414651"
            fontSize="14px"
            fontWeight="500"
            px="16px"
            py="6px"
            borderRadius="8px"
            bg="white"
            leftIcon={
              <img
                src="/img/upload.svg"
                alt="upload"
                width="16px"
                height="16px"
              />
            }
            _hover={{bg: "#F8F9FA"}}
            onClick={() => handleUploadClick(fileRef)}>
            Upload
          </Button>
          <input
            ref={fileRef}
            type="file"
            style={{display: "none"}}
            onChange={(e) => handleFileChange(e, index)}
          />
        </Flex>
      </Box>
    );
  };

  return (
    <Box className={styles.stepContentQuestionnaire}>
      <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
        Questionnaire
      </Text>
      <Text fontSize="16px" color="#414651" mb="14px">
        CargoBarn Questions
      </Text>

      <QuestionSection index={1} control={control} />
      <QuestionSection index={2} control={control} />
    </Box>
  );
};

export default QuestionnaireStep;
