import React, {useMemo} from "react";
import {Box, Button, Flex, Text} from "@chakra-ui/react";
import {useWatch} from "react-hook-form";
import {DeleteIcon} from "@chakra-ui/icons";
import HFTextField from "../../../../components/HFTextField";
import HFSelect from "../../../../components/HFSelect";
import {useFieldArray} from "react-hook-form";

function StopReferences({control, stopIndex}) {
  const allReferences = useWatch({
    control,
    name: "new_references",
    defaultValue: [],
  });

  const {fields, remove} = useFieldArray({
    control,
    name: "new_references",
  });

  console.log("fieldsfields", fields);

  const stopReferences = useMemo(() => {
    if (!allReferences || !Array.isArray(allReferences)) return [];
    return allReferences
      .map((ref, idx) => {
        const field = fields[idx];
        return {
          ...ref,
          arrayIndex: idx,
          fieldId: field?.id,
        };
      })
      .filter((ref) => {
        const refIndex =
          typeof ref.index === "number" ? ref.index : parseInt(ref.index);
        return refIndex === stopIndex + 1;
      });
  }, [allReferences, stopIndex, fields]);

  const referenceTypeOptions = [
    {label: "PU #", value: "PU"},
    {label: "PO #", value: "PO"},
    {label: "Other #", value: "Other"},
  ];

  const findReferenceArrayIndex = (referenceData) => {
    if (referenceData.fieldId) {
      const indexById = fields.findIndex(
        (field) => field.id === referenceData.fieldId
      );
      if (indexById !== -1) return indexById;
    }

    if (typeof referenceData.arrayIndex === "number") {
      return referenceData.arrayIndex;
    }

    return fields.findIndex((field, idx) => {
      const ref = allReferences[idx];
      return (
        ref &&
        ref.index === referenceData.index &&
        ref.type === referenceData.type &&
        ref.number === referenceData.number
      );
    });
  };

  return (
    <Box mt="24px" w="100%">
      {stopReferences?.length > 0 ? (
        <Flex flexDirection="column" gap="12px">
          {stopReferences.map((reference, idx) => {
            const arrayIndex = reference.arrayIndex;
            const fieldId = reference.fieldId || `ref-${arrayIndex}-${idx}`;
            const currentReferenceType = reference.type || "PU #";
            const showDescription = currentReferenceType === "Other #";

            return (
              <Box key={fieldId} borderRadius="8px">
                <Flex gap="6px" alignItems="flex-start" flexWrap="wrap">
                  <Box flex="1" minW="180px">
                    <Text
                      mb="6px"
                      fontSize="14px"
                      fontWeight="500"
                      color="#414651">
                      Reference Number
                    </Text>
                    <HFTextField
                      control={control}
                      name={`new_references.${arrayIndex}.number`}
                      placeholder="Enter Reference Number"
                      border="1px solid #D5D7DA"
                      borderRadius="8px"
                      size="md"
                    />
                  </Box>

                  <Box flex="1" minW="180px">
                    <Text
                      mb="6px"
                      fontSize="14px"
                      fontWeight="500"
                      color="#414651">
                      Reference Type <span style={{color: "#FF6B35"}}>*</span>
                    </Text>
                    <HFSelect
                      control={control}
                      name={`new_references.${arrayIndex}.type`}
                      options={referenceTypeOptions}
                      placeholder="PU #"
                      border="1px solid #D5D7DA"
                      borderRadius="8px"
                    />
                  </Box>

                  {showDescription && (
                    <Box flex="1" minW="180px">
                      <Text
                        mb="6px"
                        fontSize="14px"
                        fontWeight="500"
                        color="#414651">
                        Reference Description{" "}
                        <span style={{color: "#FF6B35"}}>*</span>
                      </Text>
                      <HFTextField
                        control={control}
                        name={`new_references.${arrayIndex}.other_description`}
                        placeholder="Enter Reference Description"
                        border="1px solid #D5D7DA"
                        borderRadius="8px"
                        size="md"
                      />
                    </Box>
                  )}
                  <Box alignSelf="flex-end">
                    <Button
                      onClick={() => {
                        const actualIndex = findReferenceArrayIndex(reference);
                        if (actualIndex !== -1) {
                          remove(actualIndex);
                        }
                      }}
                      bg="transparent"
                      _hover={{bg: "#F8F9FA"}}
                      p="8px"
                      minW="auto"
                      size="sm">
                      <DeleteIcon w="16px" h="16px" color="#FF6B35" />
                    </Button>
                  </Box>
                </Flex>
              </Box>
            );
          })}
        </Flex>
      ) : (
        <Box
          p="16px"
          borderRadius="8px"
          border="1px dashed #D5D7DA"
          bg="#FAFAFA"
          textAlign="center">
          <Text fontSize="14px" color="#A4A7AE">
            No references added yet. Add references from the Reference section
            above.
          </Text>
        </Box>
      )}
    </Box>
  );
}

export default StopReferences;
