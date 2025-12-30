import React, {useState} from "react";
import {
  Box,
  Text,
  HStack,
  VStack,
  Badge,
  Button,
  Icon,
  Flex,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import {ExternalLinkIcon, StarIcon} from "@chakra-ui/icons";
import {format, isValid} from "date-fns";
import carrierService from "@services/carrierService";
import {useSelector} from "react-redux";

const ReviewElement = ({
  review,
  allCarriers = false,
  onView = () => {},
  refetch = () => {},
}) => {
  const toast = useToast();
  const [loading, setLoading] = useState(null);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const {
    email,
    legal_name: company_name,
    companies_rating: rating,
    joined_at: connected_date,
    guid,
  } = review;

  const handleAddCarrier = (carrier) => {
    setLoading({
      id: guid,
    });
    const data = {
      joined_at: new Date().toISOString(),
      brokers_id: brokersId,
      companies_id: guid,
    };
    carrierService
      .addCarrier(data)
      .then(() => {
        toast({
          title: "Carrier Added Successfully!",
          description: "The carrier has been added to the system",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
        refetch();
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setLoading(null);
      });
  };

  return (
    <Flex
      flexDirection="column"
      bg="white"
      borderRadius="lg"
      border="1px solid #E2E8F0"
      boxShadow="sm"
      _hover={{boxShadow: "md"}}
      transition="all 0.2s">
      <VStack
        px="20px"
        py={"20px"}
        borderBottom="1px solid #E2E8F0"
        spacing={4}
        align="stretch">
        <HStack justify="space-between" align="flex-start">
          <Box
            w="52px"
            h="52px"
            borderRadius="md"
            display="flex"
            alignItems="center"
            justifyContent="center"
            border="1px solid #E2E8F0">
            {/* <img src="/img/carrierLogo.svg" alt="" width /> */}
            <Text fontSize={"18px"} fontWeight={"700"} color="#181D27">
              {review?.email?.[0] || "C"}
            </Text>
          </Box>

          <Flex h="52px" flexDirection="column" gap="0px">
            <HStack alignItems="center" mt="6px" spacing={"10px"}>
              <Text fontSize="16px" fontWeight="600" color="gray.700">
                {rating ?? "5.0"}
              </Text>
              <HStack spacing={1}>
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    w="20px"
                    h="20px"
                    color="gold"
                    fill="currentColor"
                  />
                ))}
              </HStack>
            </HStack>
          </Flex>
        </HStack>

        <Text fontSize="16px" fontWeight="600" color="#181D27">
          {company_name}
        </Text>

        {!allCarriers && (
          <Text fontSize="15px" fontWeight="400" color="#535862">
            Connected{" "}
            {isValid(new Date(connected_date))
              ? format(new Date(connected_date), "MM/dd/yyyy")
              : "Unknown Date"}
          </Text>
        )}

        <HStack spacing={2}>
          <Text fontSize="14px" color="#EF6820" fontWeight="500">
            {email}
          </Text>
          <Icon as={ExternalLinkIcon} w="12px" h="12px" color="#EF6820" />
        </HStack>
      </VStack>

      <Flex justify="flex-end" py="16px" px="24px">
        <Button
          variant="ghost"
          color="#EF6820"
          fontSize="16px"
          fontWeight="500"
          p="0"
          h="auto"
          _hover={{bg: "transparent", textDecoration: "underline"}}
          isDisabled={loading?.id === review?.guid}
          onClick={() => {
            if (allCarriers) {
              handleAddCarrier(review);
            } else {
              onView(review);
            }
          }}>
          {allCarriers ? (
            loading?.id === review?.guid ? (
              <Spinner size="sm" color="#EF6820" />
            ) : (
              "Add"
            )
          ) : (
            "View"
          )}
        </Button>
      </Flex>
    </Flex>
  );
};

export default ReviewElement;
