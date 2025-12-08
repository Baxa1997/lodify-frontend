import React from "react";
import {
  Box,
  Flex,
  Text,
  Button,
  HStack,
  VStack,
  Icon,
} from "@chakra-ui/react";
import {StarIcon, ExternalLinkIcon} from "@chakra-ui/icons";
import {format} from "date-fns";
import {useNavigate} from "react-router-dom";

export const AgreementCard = ({agreement}) => {
  const navigate = useNavigate();

  const getCompanyInitials = (name) => {
    if (!name) return "C";
    const words = name.split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const companyName =
    agreement?.company_name || agreement?.legal_name || "N/A";
  const rating = agreement?.rating ?? "5.0";
  const email = agreement?.email || "";
  const connectedDate = agreement?.connected_date
    ? format(new Date(agreement.connected_date), "MM/dd/yyyy")
    : agreement?.joined_at
    ? format(new Date(agreement.joined_at), "MM/dd/yyyy")
    : format(new Date(), "MM/dd/yyyy");

  const handleView = () => {
    if (agreement?.companies_id || agreement?.guid) {
      navigate(
        `/admin/company?id=${agreement.companies_id || agreement.guid}`
      );
    }
  };

  return (
    <Box
      w="100%"
      h="250px"
      bg="white"
      borderRadius="12px"
      border="1px solid #E2E8F0"
      boxShadow="0 1px 3px rgba(0, 0, 0, 0.1)"
      display="flex"
      flexDirection="column"
      transition="all 0.2s"
      _hover={{boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"}}>
      <Flex
        p="20px 20px 0"
        justify="space-between"
        align="flex-start"
        mb="14px">
        <Box
          w="48px"
          h="48px"
          borderRadius="8px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          border="1px solid #E2E8F0"
          bg="#F9FAFB">
          <Text fontSize="18px" fontWeight="700" color="#181D27">
            {getCompanyInitials(companyName)}
          </Text>
        </Box>
        <VStack align="flex-end" spacing="8px">
          <HStack spacing="4px">
            <Text fontSize="14px" fontWeight="600" color="#181D27">
              {rating}
            </Text>
            <HStack spacing="2px">
              {[...Array(5)].map((_, i) => (
                <Icon
                  key={i}
                  as={StarIcon}
                  w="14px"
                  h="14px"
                  color="gold"
                  fill="currentColor"
                />
              ))}
            </HStack>
          </HStack>
        </VStack>
      </Flex>

      <Text
        px="20px"
        fontSize="16px"
        fontWeight="600"
        color="#181D27"
        mb="8px"
        noOfLines={2}>
        {companyName}
      </Text>

      <Text
        px="20px"
        fontSize="14px"
        fontWeight="400"
        color="#535862"
        mb="8px">
        Connected {connectedDate}
      </Text>

      <HStack px="20px" spacing="6px" mb="12px">
        <Text fontSize="14px" color="#EF6820" fontWeight="500">
          {email || "N/A"}
        </Text>
        {email && (
          <Icon
            as={ExternalLinkIcon}
            w="14px"
            h="14px"
            color="#EF6820"
          />
        )}
      </HStack>

      <Flex
        p="10px 24px"
        borderTop="1px solid #E2E8F0"
        justify="flex-end"
        mt="auto">
        <Button
          size="sm"
          color="#EF6820"
          variant="ghost"
          fontWeight="700"
          fontSize="14px"
          _hover={{bg: "#FEF3EE"}}
          onClick={handleView}>
          View
        </Button>
      </Flex>
    </Box>
  );
};

