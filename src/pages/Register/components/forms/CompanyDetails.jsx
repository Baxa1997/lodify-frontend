import React, { useEffect, useState } from "react";
import { Box, HStack, Button, Text, Flex } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useGetLodify } from "@services/lodify-user.service";
import HFTextField from "@components/HFTextField";

const SearchToggle = ({
  onNext = () => {},
  watch,
  control,
  reset,
  getValues,
}) => {
  const [searchStatus, setSearchStatus] = useState("idle");
  const [searchType, setSearchType] = useState("US DOT");
  const [companyData, setCompanyData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const fmcsa = watch("us_dot");

  const { data, isSuccess, isError, error, refetch, isLoading } = useGetLodify(
    fmcsa,
    {
      queryKey: ["GET_FMCSA_DATA", fmcsa],
      enabled: Boolean(fmcsa),
    },
  );

  useEffect(() => {
    if (isSuccess && data) {
      const responseData = data?.data?.[0];

      if (responseData) {
        const isTaken =
          responseData.is_taken || responseData.user_exists || false;

        if (isTaken) {
          setSearchStatus("taken");
          setCompanyData(responseData);
        } else {
          setSearchStatus("success");
          setCompanyData(responseData);
          reset({
            ...getValues(),
            us_dot: fmcsa,
            physical_address1: responseData?.phy_street,
            city: responseData?.phy_city,
            state: responseData?.phy_state,
            zip_code: responseData?.phy_zip,
            country: responseData?.phy_country,
            email: responseData?.email_address,
            phone: `+1${responseData?.telephone}`,
            legal_name: responseData?.legal_name,
            dba_name: responseData?.dba_name,
          });
        }
      } else {
        setSearchStatus("error");
        setErrorMessage("Company not found");
      }
    }
  }, [isSuccess, data, fmcsa, reset, getValues]);

  useEffect(() => {
    if (isError) {
      setSearchStatus("error");
      setErrorMessage(
        error?.response?.data?.message || "Failed to search company",
      );
    }
  }, [isError, error]);

  return (
    <>
      <Box
        maxWidth="300px"
        mb="32px">
        <Text
          color="#181D27"
          fontSize="16px"
          fontWeight="600"
          mb="8px">
          Broker Details
        </Text>
        <Text
          fontWeight="400"
          fontSize="14px"
          color="#535862">
          Choose your carrier. If you're a dispatch service, start with one for
          now and you can add more later.{" "}
        </Text>
      </Box>
      <HStack
        spacing={3}
        mt={4}>
        <HStack
          height="44px"
          spacing={0}
          p="4px"
          border="1px solid #E5E7EB"
          borderRadius="8px"
          overflow="hidden"
          bg="#F9FAFB">
          <Button
            boxShadow={"rgba(10, 13, 18, 0.1)"}
            isDisabled={true}
            size="sm"
            variant="ghost"
            bg={searchType === "MC" ? "#fff" : ""}
            color="#374151"
            fontSize="14px"
            fontWeight="500"
            onClick={() => setSearchType("MC")}
            _hover={{ bg: "#F9FAFB" }}>
            MC
          </Button>
          <Button
            boxShadow="rgba(10, 13, 18, 0.1)"
            size="sm"
            variant="ghost"
            bg={searchType === "US DOT" ? "#fff" : ""}
            color="#374151"
            fontSize="14px"
            fontWeight="500"
            onClick={() => setSearchType("US DOT")}
            _hover={{ bg: "#F9FAFB" }}>
            US DOT
          </Button>
        </HStack>

        <Box
          position="relative"
          flex="1">
          <HFTextField
            control={control}
            name="us_dot"
            placeholder={`${searchType} Number`}
          />
          <SearchIcon
            w="14px"
            h="14px"
            color="#6B7280"
            position="absolute"
            right="10px"
            top="50%"
            transform="translateY(-50%)"
            pointerEvents="none"
          />
        </Box>
      </HStack>

      {searchStatus === "success" && (
        <>
          <Box mt="20px">
            <Text
              mb="6px"
              fontWeight="500"
              fontSize="14px"
              color="#414651">
              Your company
            </Text>
            <Box
              p="10px 12px"
              border="2px solid #EF6820"
              h="96px"
              borderRadius="8px">
              <Text
                fontWeight="400"
                color="#181D27">
                {companyData?.legal_name || ""}
              </Text>
              <Text
                fontWeight="400"
                color="#181D27">
                US DOT# {companyData?.dot_number || "03472971"}
              </Text>
              {/* <Text color="#535862" fontSize="14px">
                MC# {companyData?.mc_number || "1137291"}
              </Text> */}
            </Box>
          </Box>

          <Button
            _hover={{ bg: "#EF6820" }}
            mt="20px"
            width="100%"
            height="40px"
            bg="#EF6820"
            color="white"
            borderRadius="8px"
            fontSize="16px"
            fontWeight="600"
            onClick={() => onNext()}>
            Continue
          </Button>

          <Flex
            justifyContent="center"
            mt="20px"
            textAlign="center"
            alignItems="center"
            gap="8px"
            cursor="pointer"
            onClick={() => {
              reset({});
              setSearchStatus("idle");
              setCompanyData(null);
            }}>
            <img
              src={"/img/backArrow.svg"}
              alt="arrow-left" />
            <Text
              fontSize="14px"
              fontWeight="400"
              color="#535862">
              Back to Select Carrier
            </Text>
          </Flex>
        </>
      )}

      {searchStatus === "taken" && (
        <>
          <Box mt="20px">
            <Text
              mb="6px"
              fontWeight="500"
              fontSize="14px"
              color="#414651">
              Company Found
            </Text>
            <Box
              p="10px 12px"
              border="2px solid #EF6820"
              h="96px"
              borderRadius="8px">
              <Text
                fontWeight="400"
                color="#181D27">
                {companyData?.legal_name || "EAGLE EYE TRUCKING LLC"}
              </Text>
              <Text
                fontWeight="400"
                color="#181D27">
                US DOT# {companyData?.dot_number || "03472971"}
              </Text>
              {/* <Text color="#535862" fontSize="14px">
                MC# {companyData?.mc_number || "1137291"}
              </Text> */}
            </Box>
          </Box>

          <Box
            mt="20px"
            p="16px"
            bg="#FFF3CD"
            border="1px solid #FFEAA7"
            borderRadius="8px">
            <Text
              color="#856404"
              fontSize="14px"
              fontWeight="500"
              mb="8px">
              Company Already Registered
            </Text>
            <Text
              color="#856404"
              fontSize="13px">
              This company is already registered in our system. You can continue
              with a different approach or contact support.
            </Text>
          </Box>

          <Button
            _hover={{ bg: "#EF6820" }}
            mt="20px"
            width="100%"
            height="40px"
            bg="#EF6820"
            color="white"
            borderRadius="8px"
            fontSize="16px"
            fontWeight="600"
            onClick={() => onNext()}>
            Continue (Next Chance)
          </Button>

          <Flex
            justifyContent="center"
            mt="20px"
            textAlign="center"
            alignItems="center"
            gap="8px"
            cursor="pointer"
            onClick={() => {
              reset({});
              setSearchStatus("idle");
              setCompanyData(null);
            }}>
            <img
              src={"/img/backArrow.svg"}
              alt="arrow-left" />
            <Text
              fontSize="14px"
              fontWeight="400"
              color="#535862">
              Back to Select Carrier
            </Text>
          </Flex>
        </>
      )}

      {searchStatus === "error" && (
        <>
          <Box
            mt="20px"
            p="8px"
            bg="#F8D7DA"
            border="1px solid #F5C6CB"
            borderRadius="8px">
            <Text
              color="#721C24"
              textAlign="center"
              fontSize="14px"
              fontWeight="500">
              No records matching USDOT #{fmcsa}{" "}
            </Text>
          </Box>
        </>
      )}

      {(searchStatus === "idle" || searchStatus === "error") && (
        <>
          <Button
            onClick={() => refetch()}
            _hover={{ bg: "#EF6820" }}
            mb="14px"
            width="100%"
            height="40px"
            bg="#EF6820"
            color="white"
            borderRadius="8px"
            fontSize="16px"
            fontWeight="600"
            mt="14px"
            isLoading={isLoading}
            loadingText="Searching...">
            Search
          </Button>
          <Box textAlign="center">
            <Text
              fontSize="14px"
              fontWeight="400"
              color="#535862">
              Don't have a DOT or MC number?
            </Text>
            <Button
              _hover={{ bg: "transparent" }}
              bg="transparent"
              border="none"
              p="0"
              m="0"
              onClick={() => onNext(true)}>
              <Text
                fontSize="14px"
                fontWeight="400"
                color="#EF6820">
                Skip this step
              </Text>
            </Button>
          </Box>
        </>
      )}
    </>
  );
};

export default SearchToggle;
