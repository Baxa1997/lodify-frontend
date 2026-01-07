import React, {useEffect, useRef, useMemo} from "react";
import {
  Box,
  Text,
  Flex,
  Button,
  RadioGroup,
  Radio,
  Input,
  FormControl,
} from "@chakra-ui/react";
import {Controller, useFieldArray} from "react-hook-form";
import styles from "../../CarrierSetup.module.scss";
import carrierService from "@services/carrierService";
import {useQuery} from "@tanstack/react-query";

// Moved outside to prevent re-creation on every render
const QuestionSection = ({
  question,
  index,
  control,
  fileName,
  onUploadClick,
  onFileChange,
  fileInputRef,
}) => {
  const {title} = question;

  return (
    <Box className={styles.questionSection} mb="24px">
      <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="16px">
        {title} {index === 0 && "(Required)"}
      </Text>

      <Controller
        control={control}
        name={`questionnaire.questions.${index}.radio_answer`}
        defaultValue=""
        render={({field}) => (
          <RadioGroup {...field} value={field.value || ""} mb="16px">
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="12px">
              <Flex
                border="1px solid #D5D7DA"
                borderRadius="8px"
                bg={field.value === "yes" ? "#FFF5ED" : "#FAFAFA"}
                p="10px 12px"
                cursor="pointer"
                onClick={() => field.onChange("yes")}>
                <Radio
                  value="yes"
                  colorScheme="orange"
                  isChecked={field.value === "yes"}
                  border="1px solid #D5D7DA"
                />
                <Text fontSize="14px" color="#414651" ml="8px">
                  Yes
                </Text>
              </Flex>

              <Flex
                bg={field.value === "no" ? "#FFF5ED" : "#FAFAFA"}
                border="1px solid #D5D7DA"
                borderRadius="8px"
                p="10px 12px"
                cursor="pointer"
                onClick={() => field.onChange("no")}>
                <Radio
                  value="no"
                  colorScheme="orange"
                  isChecked={field.value === "no"}
                  border="1px solid #D5D7DA"
                />
                <Text fontSize="14px" color="#414651" ml="8px">
                  No
                </Text>
              </Flex>
            </Box>
          </RadioGroup>
        )}
      />

      <Box mb="16px">
        <FormControl>
          <Box
            as="label"
            fontSize="14px"
            fontWeight="500"
            color="#414651"
            mb="6px"
            display="block">
            Additional Information (Optional)
          </Box>
          <Controller
            control={control}
            name={`questionnaire.questions.${index}.text_answer`}
            defaultValue=""
            render={({field}) => (
              <Input
                {...field}
                placeholder="Enter your answer"
                px="12px"
                py="8px"
                borderRadius="8px"
                border="1px solid #D5D7DA"
              />
            )}
          />
        </FormControl>
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
            {fileName}
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
          onClick={onUploadClick}>
          Upload
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          style={{display: "none"}}
          onChange={onFileChange}
        />
      </Flex>
    </Box>
  );
};

const QuestionnaireStep = ({control}) => {
  const fileInputRefs = useRef({});

  const {data: questionnaireResponse} = useQuery({
    queryKey: ["GET_QUESTIONNAIRE"],
    queryFn: () => carrierService.getQuestionnaire("questions"),
    select: (res) => res?.data?.response || [],
  });

  const questions = useMemo(() => {
    return Array.isArray(questionnaireResponse) ? questionnaireResponse : [];
  }, [questionnaireResponse]);

  const {fields, replace, update} = useFieldArray({
    control,
    name: "questionnaire.questions",
  });

  useEffect(() => {
    if (!questions?.length) return;
    if (fields.length) return;

    replace(
      questions.map((q) => ({
        guid: q.guid,
        radio_answer: "",
        text_answer: "",
        file: null,
        file_name: "",
      }))
    );
  }, [questions, fields.length, replace]);

  const handleUploadClick = (index) => {
    fileInputRefs.current[index]?.click();
  };

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file && fields[index]) {
      update(index, {
        ...fields[index],
        file: file,
        file_name: file.name,
      });
    }
  };

  const getFileInputRef = (index) => {
    if (!fileInputRefs.current[index]) {
      fileInputRefs.current[index] = React.createRef();
    }
    return fileInputRefs.current[index];
  };

  return (
    <Box className={styles.stepContentQuestionnaire}>
      <Text fontSize="24px" fontWeight="bold" color="#1e293b" mb="8px">
        Questionnaire
      </Text>
      <Text fontSize="16px" color="#414651" mb="24px">
        CargoBarn Questions
      </Text>

      {questions.length > 0 ? (
        questions.map((question, index) => {
          const field = fields[index];
          const fileName = field?.file_name || "No file chosen";

          return (
            <QuestionSection
              key={question.guid}
              question={question}
              index={index}
              control={control}
              fileName={fileName}
              onUploadClick={() => handleUploadClick(index)}
              onFileChange={(e) => handleFileChange(e, index)}
              fileInputRef={getFileInputRef(index)}
            />
          );
        })
      ) : (
        <Text fontSize="14px" color="#6B7280">
          Loading questions...
        </Text>
      )}
    </Box>
  );
};

export default QuestionnaireStep;
