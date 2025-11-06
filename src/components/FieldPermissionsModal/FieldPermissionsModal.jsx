import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Box,
  Text,
  HStack,
  VStack,
  useToast,
} from "@chakra-ui/react";

export const FieldPermissionsModal = ({
  isOpen,
  onClose,
  fieldPermissions = [],
  tableSlug,
  tableIndex,
  register,
  setValue,
  watch,
  isLoading = false,
}) => {
  const toast = useToast();
  const [selectAllView, setSelectAllView] = useState(false);
  const [selectAllEdit, setSelectAllEdit] = useState(false);

  const watchedValues = watch();

  const filteredFields = fieldPermissions.filter(
    (field) => field.table_slug === tableSlug,
  );

  const handleSelectAllView = (checked) => {
    setSelectAllView(checked);
    filteredFields.forEach((_, index) => {
      setValue(
        `${tableIndex}.field_permissions.${index}.view_permission`,
        checked,
      );
    });
  };

  const handleSelectAllEdit = (checked) => {
    setSelectAllEdit(checked);
    filteredFields.forEach((_, index) => {
      setValue(
        `${tableIndex}.field_permissions.${index}.edit_permission`,
        checked,
      );
    });
  };

  useEffect(() => {
    if (filteredFields.length > 0) {
      const allViewChecked = filteredFields.every(
        (_, index) =>
          watchedValues[
            `${tableIndex}.field_permissions.${index}.view_permission`
          ],
      );
      const allEditChecked = filteredFields.every(
        (_, index) =>
          watchedValues[
            `${tableIndex}.field_permissions.${index}.edit_permission`
          ],
      );
      setSelectAllView(allViewChecked);
      setSelectAllEdit(allEditChecked);
    }
  }, [watchedValues, filteredFields, tableIndex]);

  const handleClose = () => {
    setSelectAllView(false);
    setSelectAllEdit(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="xl"
      isCentered>
      <ModalOverlay />
      <ModalContent
        maxW="800px"
        maxH="80vh">
        <ModalHeader>
          <Text
            fontSize="lg"
            fontWeight="semibold"
            color="gray.900">
            Field Permissions
          </Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody
          pb={6}
          overflow="hidden">
          <VStack
            spacing={4}
            align="stretch"
            height="100%">
            <Box
              overflowY="auto"
              maxH="400px"
              border="1px solid"
              borderColor="gray.200"
              borderRadius="8px">
              <Table
                variant="simple"
                size="sm">
                <Thead
                  position="sticky"
                  top="0"
                  bg="white"
                  zIndex={1}>
                  <Tr>
                    <Th
                      width="60px"
                      textAlign="center"
                      bg="gray.50">
                      No
                    </Th>
                    <Th bg="gray.50">Field name</Th>
                    <Th
                      textAlign="center"
                      width="150px"
                      bg="gray.50">
                      <HStack
                        justify="center"
                        spacing={2}>
                        <Text fontSize="sm">View permission</Text>
                        <Checkbox
                          isChecked={selectAllView}
                          onChange={(e) =>
                            handleSelectAllView(e.target.checked)
                          }
                          size="sm"
                        />
                      </HStack>
                    </Th>
                    <Th
                      textAlign="center"
                      width="150px"
                      bg="gray.50">
                      <HStack
                        justify="center"
                        spacing={2}>
                        <Text fontSize="sm">Edit permission</Text>
                        <Checkbox
                          isChecked={selectAllEdit}
                          onChange={(e) =>
                            handleSelectAllEdit(e.target.checked)
                          }
                          size="sm"
                        />
                      </HStack>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredFields.map((field, index) => (
                    <Tr key={field.field_id}>
                      <Td
                        textAlign="center"
                        fontWeight="medium">
                        {index + 1}
                      </Td>
                      <Td fontWeight="medium">{field.label}</Td>
                      <Td textAlign="center">
                        <Checkbox
                          {...register(
                            `${tableIndex}.field_permissions.${index}.view_permission`,
                          )}
                          size="sm"
                          borderColor="#D5D7DA"
                        />
                      </Td>
                      <Td textAlign="center">
                        <Checkbox
                          {...register(
                            `${tableIndex}.field_permissions.${index}.edit_permission`,
                          )}
                          size="sm"
                          borderColor="#D5D7DA"
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
            <Box>
              <Text
                fontSize="sm"
                color="gray.600">
                Count: {filteredFields.length}
              </Text>
            </Box>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <HStack spacing={2}>
            <Button
              variant="outline"
              onClick={handleClose}
              size="md"
              isDisabled={isLoading}>
              Cancel
            </Button>
            <Button
              onClick={handleClose}
              colorScheme="blue"
              size="md"
              isLoading={isLoading}>
              Save Changes
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
