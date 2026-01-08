import React, {useEffect, useMemo} from "react";
import {
  Box,
  Text,
  RadioGroup,
  Radio,
  Input,
  FormControl,
  Flex,
} from "@chakra-ui/react";
import {Controller, useFieldArray, useWatch} from "react-hook-form";
import styles from "../../CarrierSetup.module.scss";
import carrierService from "@services/carrierService";
import {useQuery} from "@tanstack/react-query";
import HFCustomFilesUpload from "@components/HFCustomFilesUpload";
import {Button} from "@chakra-ui/react";
import {useSearchParams} from "react-router-dom";

const QuestionSection = ({question, index, control}) => {
  const {title} = question;

  const fileValue = useWatch({
    control,
    name: `questionnaire.questions.${index}.document`,
    defaultValue: "",
  });

  const formatFileName = (url) => {
    if (!url || typeof url !== "string") return "No file chosen";

    let filename = "";
    try {
      const urlObj = new URL(url);
      filename = urlObj.pathname.split("/").pop() || "";
    } catch {
      filename = url.split("/").pop() || url;
    }

    if (!filename) return "No file chosen";

    try {
      filename = decodeURIComponent(filename);
    } catch {}

    const guidPattern =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_/i;
    if (guidPattern.test(filename)) {
      filename = filename.replace(guidPattern, "");
    }

    const maxLength = 30;
    if (filename.length > maxLength) {
      const lastDot = filename.lastIndexOf(".");
      if (lastDot > 0) {
        const ext = filename.substring(lastDot);
        const base = filename.substring(0, lastDot);
        const truncatedBase =
          base.substring(0, maxLength - ext.length - 3) + "...";
        filename = truncatedBase + ext;
      } else {
        filename = filename.substring(0, maxLength - 3) + "...";
      }
    }

    return filename;
  };

  const fileName = formatFileName(fileValue);

  return (
    <Box className={styles.questionSection} mb="24px">
      <Text fontSize="16px" fontWeight="600" color="#1e293b" mb="16px">
        {title}
      </Text>

      <Controller
        control={control}
        name={`questionnaire.questions.${index}.answer`}
        defaultValue=""
        render={({field}) => (
          <RadioGroup {...field} value={field.value || ""} mb="16px">
            <Box display="grid" gridTemplateColumns="repeat(2, 1fr)" gap="12px">
              <Flex
                border="1px solid #D5D7DA"
                borderRadius="8px"
                bg={field.value === "Yes" ? "#FFF5ED" : "#FAFAFA"}
                p="10px 12px"
                cursor="pointer"
                onClick={() => field.onChange("Yes")}>
                <Radio
                  value="Yes"
                  colorScheme="orange"
                  isChecked={field.value === "Yes"}
                  border="1px solid #D5D7DA"
                />
                <Text fontSize="14px" color="#414651" ml="8px">
                  Yes
                </Text>
              </Flex>

              <Flex
                bg={field.value === "No" ? "#FFF5ED" : "#FAFAFA"}
                border="1px solid #D5D7DA"
                borderRadius="8px"
                p="10px 12px"
                cursor="pointer"
                onClick={() => field.onChange("No")}>
                <Radio
                  value="No"
                  colorScheme="orange"
                  isChecked={field.value === "No"}
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
            name={`questionnaire.questions.${index}.other`}
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
        <HFCustomFilesUpload
          control={control}
          name={`questionnaire.questions.${index}.document`}
          multiple={false}>
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
            _hover={{bg: "#F8F9FA"}}>
            Upload
          </Button>
        </HFCustomFilesUpload>
      </Flex>
    </Box>
  );
};

const QuestionnaireStep = ({control}) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");

  const {data: questionnaireResponse} = useQuery({
    queryKey: ["GET_QUESTIONNAIRE"],
    queryFn: () => carrierService.getQuestionnaire("questions"),
    select: (res) => res?.data?.response || [],
  });

  const questions = useMemo(() => {
    return Array.isArray(questionnaireResponse) ? questionnaireResponse : [];
  }, [questionnaireResponse]);

  const {fields, replace} = useFieldArray({
    control,
    name: "questionnaire.questions",
  });

  useEffect(() => {
    if (!questions?.length) return;
    if (fields.length) return;

    replace(
      questions.map((q) => ({
        questions_id: q.guid,
        is_new: true,
        companies_id: id,
        answer: "",
        other: "",
        document: "",
      }))
    );
  }, [questions, fields.length, replace]);

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
          return (
            <QuestionSection
              key={question.guid}
              question={question}
              index={index}
              control={control}
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
