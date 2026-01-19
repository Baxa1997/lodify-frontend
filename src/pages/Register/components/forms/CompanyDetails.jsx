import React, {useEffect, useState} from "react";
import {Box, HStack, Button, Text, Flex, VStack, Input} from "@chakra-ui/react";
import {SearchIcon, AddIcon, DeleteIcon} from "@chakra-ui/icons";
import {useGetLodify, useGetLodifyMC} from "@services/lodify-user.service";
import HFTextField from "@components/HFTextField";
import {useFieldArray, useWatch} from "react-hook-form";

const SearchToggle = ({
  onNext = () => {},
  watch,
  control,
  reset,
  getValues,
}) => {
  const [searchStatus, setSearchStatus] = useState("idle");

  const [searchType, setSearchType] = useState(() => {
    const stored = localStorage.getItem("number_type");
    return stored || "US DOT";
  });
  const [companyData, setCompanyData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [newMcNumber, setNewMcNumber] = useState("");
  const fmcsa = watch("us_dot");
  const mcNumber = watch("mc_number");

  const {fields, append, remove} = useFieldArray({
    control,
    name: "mc_numbers",
  });

  const {data, isSuccess, isError, error, refetch, isLoading} = useGetLodify(
    fmcsa,
    {
      queryKey: ["GET_FMCSA_DATA", fmcsa],
      enabled: Boolean(fmcsa) && searchType === "US DOT",
    }
  );

  const {
    data: mcData,
    isSuccess: isSuccessMC,
    isError: isErrorMC,
    error: errorMC,
    refetch: refetchMC,
    isLoading: isLoadingMC,
  } = useGetLodifyMC(mcNumber, {
    queryKey: ["GET_MC_DATA", mcNumber],
    enabled: Boolean(mcNumber) && searchType === "MC",
    onSuccess: (data) => {
      console.log('mcDatamcData', data)
    },
  });
  console.log('mcDatamcData', mcData)
  useEffect(() => {
    if (isSuccess && data && searchType === "US DOT") {
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
            phone: `+1${responseData?.telephone ?? responseData?.phone}`,
            legal_name: responseData?.legal_name,
            dba_name: responseData?.dba_name,
            docket1: responseData?.docket1,
          });
        }
      } else {
        setSearchStatus("error");
        setErrorMessage("Company not found");
      }
    }
  }, [isSuccess, data, fmcsa, reset, getValues, searchType]);
  console.log('mcDatamcData', mcData)
  useEffect(() => {
    if (isSuccessMC && mcData && searchType === "MC") {
      const responseData = mcData?.data;

      if (responseData) {
        const isTaken =
          responseData.is_taken || responseData.user_exists || false;

        if (isTaken) {
          setSearchStatus("taken");
          setCompanyData(responseData);
        } else {
          console.log('responseData', responseData)
          setSearchStatus("success");
          setCompanyData(responseData);
          reset({
            ...getValues(),
            mc_number: mcNumber,
            physical_address1: responseData?.physical_address1 ?? responseData?.physical_address,
            city: responseData?.city,
            state: responseData?.state,
            zip_code: responseData?.zip,
            country: responseData?.country,
            email: responseData?.email,
            phone: `+1${responseData?.telephone ?? responseData?.phone}`,
            legal_name: responseData?.legal_name,
            dba_name: responseData?.dba_name,
          });
        }
      } else {
        setSearchStatus("error");
        setErrorMessage("Company not found");
      }
    }
  }, [isSuccessMC, mcData, mcNumber, reset, getValues, searchType]);

  useEffect(() => {
    if (isError && searchType === "US DOT") {
      setSearchStatus("error");
      setErrorMessage(
        error?.response?.data?.message || "Failed to search company"
      );
    }
  }, [isError, error, searchType]);

  useEffect(() => {
    if (isErrorMC && searchType === "MC") {
      setSearchStatus("error");
      setErrorMessage(
        errorMC?.response?.data?.message || "Failed to search company"
      );
    }
  }, [isErrorMC, errorMC, searchType]);

  useEffect(() => {
    setSearchStatus("idle");
    setCompanyData(null);
    setErrorMessage("");
  }, [searchType]);

  useEffect(() => {
    const storedNumberType = localStorage.getItem("number_type");
    if (!storedNumberType) {
      localStorage.setItem("number_type", "US DOT");
    }
  }, []);
  console.log("watchcchchchc", watch())
  return (
    <>
      <Box maxWidth="300px" mb="32px">
        <Text color="#181D27" fontSize="16px" fontWeight="600" mb="8px">
          {localStorage.getItem("register_user_type") === "carrier"
            ? "Carrier"
            : "Broker"}{" "}
          Details
        </Text>
        <Text fontWeight="400" fontSize="14px" color="#535862">
          Choose your{" "}
          {localStorage.getItem("register_user_type") === "carrier"
            ? "carrier"
            : "broker"}
          . If you're a dispatch service, start with one for now and you can add
          more later.{" "}
        </Text>
      </Box>
      <HStack spacing={3} mt={4}>
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
            size="sm"
            variant="ghost"
            bg={searchType === "MC" ? "#fff" : ""}
            color="#374151"
            fontSize="14px"
            fontWeight="500"
            onClick={() => {
              localStorage.setItem("number_type", "MC");
              setSearchType("MC");
            }}
            _hover={{bg: "#F9FAFB"}}>
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
            onClick={() => {
              localStorage.setItem("number_type", "US DOT");
              setSearchType("US DOT");
            }}
            _hover={{bg: "#F9FAFB"}}>
            US DOT
          </Button>
        </HStack>

        {searchType === "US DOT" && (
          <Box position="relative" flex="1">
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
        )}

        {searchType === "MC" && (
          <Box position="relative" flex="1">
            <HFTextField
              control={control}
              name="mc_number"
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
        )}
      </HStack>

      {searchStatus === "success" && (
        <>
          {searchType === "US DOT" ? (
            <Box mt="20px">
              <Text mb="6px" fontWeight="500" fontSize="14px" color="#414651">
                Your company
              </Text>
              <Box
                p="10px 12px"
                border="2px solid #EF6820"
                h="96px"
                borderRadius="8px">
                <Text fontWeight="400" color="#181D27">
                  {companyData?.legal_name || ""}
                </Text>
                {searchType === "US DOT" && (
                  <Text fontWeight="400" color="#181D27">
                    US DOT# {companyData?.dot_number || ""}
                  </Text>
                )}
                {searchType === "MC" && (
                  <Text fontWeight="400" color="#181D27">
                    MC# {mcNumber || ""}
                  </Text>
                )}
              </Box>
            </Box>
          ) : (
            <Box mt="20px">
              <Text mb="6px" fontWeight="500" fontSize="14px" color="#414651">
                Your company
              </Text>
              <Box
                p="10px 12px"
                border="2px solid #EF6820"
                h="96px"
                borderRadius="8px">
                <Text fontWeight="400" color="#181D27">
                  {mcData?.data?.legal_name || ""}
                </Text>
                <Text fontWeight="400" color="#181D27">
                  {mcData?.data?.mc_mx_ff_numbers?.[1] || ""}
                </Text>
              </Box>
            </Box>
          )}

          {searchType === "MC" && (
            <Box mt="24px">
              <VStack spacing="12px" align="stretch">
                {fields.map((field, index) => (
                  <Box
                    key={field.id}
                    p="12px"
                    borderRadius="8px"
                    border="1px solid #E9EAEB"
                    bg="#FAFAFA">
                    <Flex
                      gap="12px"
                      alignItems="center"
                      justifyContent="space-between">
                      <Box flex="1">
                        <Text
                          mb="6px"
                          fontSize="14px"
                          fontWeight="500"
                          color="#414651">
                          MC Number
                        </Text>
                        <HFTextField
                          control={control}
                          name={`mc_numbers.${index}.mc_number`}
                          placeholder="Enter MC Number"
                          border="1px solid #D5D7DA"
                          borderRadius="8px"
                          size="md"
                        />
                      </Box>
                      <Box alignSelf="flex-end" pt="28px">
                        <Button
                          onClick={() => remove(index)}
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
                ))}
              </VStack>
            </Box>
          )}

          <Button
            _hover={{bg: "#EF6820"}}
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
              setNewMcNumber("");
            }}>
            <img src={"/img/backArrow.svg"} alt="arrow-left" />
            <Text fontSize="14px" fontWeight="400" color="#535862">
              Back to Select{" "}
              {localStorage.getItem("register_user_type") === "carrier"
                ? "Carrier"
                : "Broker"}
            </Text>
          </Flex>
        </>
      )}

      {searchStatus === "taken" && (
        <>
          <Box mt="20px">
            <Text mb="6px" fontWeight="500" fontSize="14px" color="#414651">
              Company Found
            </Text>
            <Box
              p="10px 12px"
              border="2px solid #EF6820"
              h="96px"
              borderRadius="8px">
              <Text fontWeight="400" color="#181D27">
                {companyData?.legal_name || "EAGLE EYE TRUCKING LLC"}
              </Text>
              {searchType === "US DOT" && (
                <Text fontWeight="400" color="#181D27">
                  US DOT# {companyData?.dot_number || "03472971"}
                </Text>
              )}
              {searchType === "MC" && (
                <Text fontWeight="400" color="#181D27">
                  MC# {mcNumber || ""}
                </Text>
              )}
            </Box>
          </Box>

          <Box
            mt="20px"
            p="16px"
            bg="#FFF3CD"
            border="1px solid #FFEAA7"
            borderRadius="8px">
            <Text color="#856404" fontSize="14px" fontWeight="500" mb="8px">
              Company Already Registered
            </Text>
            <Text color="#856404" fontSize="13px">
              This company is already registered in our system. You can continue
              with a different approach or contact support.
            </Text>
          </Box>

          <Button
            _hover={{bg: "#EF6820"}}
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
              setNewMcNumber("");
            }}>
            <img src={"/img/backArrow.svg"} alt="arrow-left" />
            <Text fontSize="14px" fontWeight="400" color="#535862">
              Back to Select{" "}
              {localStorage.getItem("register_user_type") === "carrier"
                ? "Carrier"
                : "Broker"}
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
              No records matching{" "}
              {searchType === "US DOT" ? `USDOT #${fmcsa}` : `MC #${mcNumber}`}{" "}
            </Text>
          </Box>
        </>
      )}

      {(searchStatus === "idle" || searchStatus === "error") && (
        <>
          <Button
            onClick={() => {
              if (searchType === "US DOT") {
                refetch();
              } else {
                refetchMC();
              }
            }}
            _hover={{bg: "#EF6820"}}
            mb="14px"
            width="100%"
            height="40px"
            bg="#EF6820"
            color="white"
            borderRadius="8px"
            fontSize="16px"
            fontWeight="600"
            mt="14px"
            isLoading={searchType === "US DOT" ? isLoading : isLoadingMC}
            loadingText="Searching...">
            Search
          </Button>
          <Box textAlign="center">
            <Text fontSize="14px" fontWeight="400" color="#535862">
              Don't have a DOT or MC number?
            </Text>
            {/* <Button
              _hover={{bg: "transparent"}}
              bg="transparent"
              border="none"
              p="0"
              m="0"
              onClick={() => onNext(true)}>
              <Text fontSize="14px" fontWeight="400" color="#EF6820">
                Skip this step
              </Text>
            </Button> */}
          </Box>
        </>
      )}
    </>
  );
};

export default SearchToggle;
