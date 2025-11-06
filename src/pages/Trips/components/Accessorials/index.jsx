import React, {useState} from "react";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  Input,
  HStack,
  VStack,
  Flex,
  Grid,
  IconButton,
  useDisclosure,
  useToast,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import {AddIcon} from "@chakra-ui/icons";
import {Controller, useFieldArray} from "react-hook-form";

function Accessorials({control, name, label, required}) {
  const {isOpen, onOpen, onClose} = useDisclosure();
  const {
    isOpen: isAddOpen,
    onOpen: onAddOpen,
    onClose: onAddClose,
  } = useDisclosure();
  const [newAccessorial, setNewAccessorial] = useState({title: "", amount: ""});
  const toast = useToast();

  const {fields, append, remove, update} = useFieldArray({
    control,
    name: name,
  });

  const handleAddAccessorial = () => {
    if (!newAccessorial.title.trim()) {
      toast({
        title: "Accessorial name is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (!newAccessorial.amount || parseFloat(newAccessorial.amount) <= 0) {
      toast({
        title: "Valid price is required",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    append({
      title: newAccessorial.title,
      amount: parseFloat(newAccessorial.amount),
    });
    setNewAccessorial({title: "", amount: ""});
    onAddClose();
  };

  const handleAmountChange = (index, amount) => {
    update(index, {
      ...fields[index],
      title: newAccessorial.title,
      amount: parseFloat(amount) || 0,
    });
  };

  const getTotalAmount = () => {
    return fields.reduce((total, field) => total + (field.amount || 0), 0);
  };

  const getDisplayValue = () => {
    if (fields.length === 0) return "Select Accessorials";
    if (fields.length === 1) return fields[0].title;
    return `${fields.length} Accessorials Selected`;
  };

  return (
    <>
      <Box>
        {label && (
          <Text mb="6px" fontSize="14px" fontWeight="500" color="#414651">
            {label}{" "}
            {required && (
              <Box as="span" color="blue.500">
                *
              </Box>
            )}
          </Text>
        )}
        <Button
          w="100%"
          h="40px"
          border="1px solid #D5D7DA"
          borderRadius="md"
          bg="white"
          color="#414651"
          fontWeight="normal"
          textAlign="left"
          justifyContent="flex-start"
          px="12px"
          _hover={{bg: "gray.50"}}
          onClick={onOpen}>
          {getDisplayValue()}
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader borderBottom="1px solid #E9EAEB">
            Accessorial's
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="stretch">
              {fields.length > 0 && (
                <Grid
                  maxH="400px"
                  overflowY="auto"
                  templateColumns="repeat(2, 1fr)"
                  gap={4}>
                  {fields.map((field, index) => (
                    <Box key={field.id}>
                      <HStack justify="space-between" mb="2">
                        <Text fontSize="14px" fontWeight="500" color="#414651">
                          {field.title}
                        </Text>
                      </HStack>
                      <Input
                        value={`$ ${field.amount}`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[^0-9.]/g, "");
                          handleAmountChange(index, value);
                        }}
                        placeholder="$ 0"
                        size="md"
                        border="1px solid #D5D7DA"
                        borderRadius="md"
                      />
                    </Box>
                  ))}
                </Grid>
              )}

              <Button
                onClick={onAddOpen}
                w="170px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                gap="8px"
                border="1px solid #ffcaad"
                bg="#fff"
                _hover={{bg: "#fff"}}>
                <AddIcon w="16px" h="16px" color="#EF6820" />
                <Text color="#181D27">Add Accessorial</Text>
              </Button>

              <Box mt="10px">
                <Text
                  pb="7px"
                  borderBottom="1px solid #E9EAEB"
                  w="100%"
                  fontSize="14px"
                  fontWeight="600"
                  color="#181D27">
                  Total Accessorial's
                </Text>
                <Text
                  p="14px 8px"
                  fontSize="16px"
                  fontWeight="600"
                  color="#181D27">
                  ${getTotalAmount().toFixed(2)}
                </Text>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter borderTop="1px solid #E9EAEB">
            <Button
              variant="outline"
              mr={3}
              onClick={onClose}
              border="1px solid #D5D7DA">
              Close
            </Button>
            <Button
              bg="#EF6820"
              color="white"
              _hover={{bg: "#EF6820"}}
              onClick={onClose}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isAddOpen} onClose={onAddClose} size="sm" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Accessorial's</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Box w="100%">
                <Text mb="2" fontSize="14px" fontWeight="500">
                  Accessorial's Title
                </Text>
                <Input
                  value={newAccessorial.title}
                  onChange={(e) =>
                    setNewAccessorial({
                      ...newAccessorial,
                      title: e.target.value,
                    })
                  }
                  placeholder="Enter accessorial name"
                  size="md"
                  border="1px solid #D5D7DA"
                  borderRadius="md"
                />
              </Box>
              <Box w="100%">
                <Text mb="2" fontSize="14px" fontWeight="500">
                  Amount
                </Text>
                <Input
                  value={newAccessorial.amount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setNewAccessorial({
                      ...newAccessorial,
                      amount: value,
                    });
                  }}
                  placeholder="$ 0.00"
                  size="md"
                  border="1px solid #D5D7DA"
                  borderRadius="md"
                />
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              mr={3}
              onClick={onAddClose}
              border="1px solid #D5D7DA">
              Close
            </Button>
            <Button
              bg="#EF6820"
              color="white"
              _hover={{bg: "#EF6820"}}
              onClick={handleAddAccessorial}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default function HFAccessorialsField({
  control,
  name,
  label,
  rules,
  required,
  disabled,
}) {
  return (
    <Controller
      control={control}
      name={name}
      defaultValue={[]}
      rules={{
        required: required ? "This is a required field" : false,
        ...rules,
      }}
      render={({field: {onChange, value}, fieldState: {error}}) => (
        <FormControl isInvalid={!!error}>
          <Accessorials
            control={control}
            label={label}
            name={name}
            required={required}
            disabled={disabled}
          />
          <FormErrorMessage>{error?.message}</FormErrorMessage>
        </FormControl>
      )}
    />
  );
}
