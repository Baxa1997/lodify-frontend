import React, {useRef} from "react";
import {
  Box,
  Text,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Button,
} from "@chakra-ui/react";
import {Controller} from "react-hook-form";
import {LuSearch} from "react-icons/lu";

const EnterCompanyFactoring = ({control}) => {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file);
    }
  };

  return (
    <Box>
      <Text fontSize="20px" fontWeight="bold" color="#1e293b" mb="8px">
        Enter your factoring company.
      </Text>
      <Text fontSize="16px" color="#414651" mb="24px" mt="8px">
        Enter the code we just sent to the mobile number you entered.
      </Text>

      <Box display="flex" flexDirection="column" gap="24px">
        <Box>
          <Text
            as="label"
            fontSize="14px"
            fontWeight="500"
            color="#414651"
            mb="6px"
            display="block">
            Search Factoring company
          </Text>
          <Controller
            control={control}
            name="factoring_company_search"
            render={({field}) => (
              <InputGroup>
                <Input
                  {...field}
                  placeholder="Enter company name"
                  border="1px solid #D5D7DA"
                  borderRadius="8px"
                  fontSize="14px"
                  px="12px"
                  py="8px"
                  height="40px"
                  pr="40px"
                  _focus={{
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 1px #3b82f6",
                  }}
                />
                <InputRightElement
                  height="40px"
                  width="40px"
                  pointerEvents="none">
                  <Box color="#64748b">
                    <LuSearch size={20} />
                  </Box>
                </InputRightElement>
              </InputGroup>
            )}
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
          <Flex alignItems="center" justifyContent="space-between">
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
              onClick={handleUploadClick}>
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              style={{display: "none"}}
              onChange={handleFileChange}
            />
          </Flex>
        </Flex>
      </Box>
    </Box>
  );
};

export default EnterCompanyFactoring;
