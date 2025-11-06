import { Box, Flex, Text } from "@chakra-ui/react";
import Activities from "./Activities";
import DispatchNotes from "./DispatchNotes";
import Documents from "./Documents";
import DoubleTable from "./DoubleTable";
import Quotes from "./Quotes";
import tripsService from "@services/tripsService";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import GoogleMap from "./GoogleMap";

function HistoryTripsTab() {
  const { id } = useParams();

  const envId = useSelector((state) => state.auth.environmentId);
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {},
  });
  const { data: tripDetails } = useQuery({
    queryKey: ["TRIP_DETAILS", id],
    queryFn: () =>
      tripsService.getTripDetailsByTripId({
        app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
        environment_id: envId,
        method: "single",
        object_data: {
          trip_id: id,
        },
        table: "trips",
      }),
    enabled: Boolean(id),
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    select: (res) => res?.data?.response?.[0] || {},
  });

  useEffect(() => {
    reset(tripDetails);
  }, [tripDetails, reset]);

  return (
    <>
      {" "}
      <Box
        mt="24px"
        borderRadius={"12px"}
        border="1px solid #E9EAEB">
        <Flex
          p="8px 16px"
          mb="6px"
          borderBottom="1px solid #E9EAEB"
          w="100%"
          justifyContent={"space-between"}>
          <Text
            pl="8px"
            w="100%"
            fontWeight={"600"}
            fontSize={"14px"}
            color={"#181D27"}>
            Bill to (Booked From)
          </Text>
          <Text
            w="100%"
            fontWeight={"600"}
            fontSize={"14px"}
            color={"#181D27"}>
            Reference #’s
          </Text>
          <Text
            w="100%"
            fontWeight={"600"}
            fontSize={"14px"}
            color={"#181D27"}>
            Remit Payment To
          </Text>
          <Text
            w="100%"
            fontWeight={"600"}
            fontSize={"14px"}
            color={"#181D27"}>
            Payable Method
          </Text>
          <Text
            w="100%"
            fontWeight={"600"}
            fontSize={"14px"}
            color={"#181D27"}>
            Shipment Type
          </Text>
          <Text
            w="100%"
            fontWeight={"600"}
            fontSize={"14px"}
            color={"#181D27"}>
            Booked By
          </Text>
        </Flex>

        <Flex
          p="0px 16px"
          borderBottom="1px solid #E9EAEB">
          <Box
            w="100%"
            p="16px 8px 16px 8px">
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              color={"#181D27"}>
              {tripDetails?.booked_from?.legal_name}
            </Text>
          </Box>

          <Box
            w="100%"
            p="16px 8px 16px 8px">
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              color={"#181D27"}>
              Ref #
              <span style={{ fontWeight: "400", color: "#414651" }}>
                {tripDetails?.reference_ref}
              </span>
            </Text>
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              color={"#181D27"}>
              PO#{" "}
              <span style={{ fontWeight: "400", color: "#414651" }}>
                {tripDetails?.reference_po}
              </span>
            </Text>
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              color={"#181D27"}>
              Other #{" "}
              <span style={{ fontWeight: "400", color: "#414651" }}>
                {tripDetails?.reference_other}
              </span>
            </Text>
          </Box>

          <Box
            w="100%"
            p="16px 8px 16px 8px">
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              color={"#181D27"}>
              RTS
            </Text>
          </Box>

          <Box
            w="100%"
            p="16px 8px 16px 8px">
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              color={"#181D27"}>
              {tripDetails?.remit_payment_to?.[0]}
            </Text>
          </Box>

          <Box
            w="100%"
            p="16px 8px 16px 8px">
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              color={"#181D27"}>
              Full Truckload
            </Text>
          </Box>

          <Box
            w="100%"
            p="16px 8px 16px 8px">
            <Text
              fontWeight={"500"}
              fontSize={"14px"}
              color={"#181D27"}>
              {tripDetails?.shipment_type?.[0]}
            </Text>
          </Box>
        </Flex>

        <Flex borderBottom="1px solid #E9EAEB">
          <Box
            borderRight="1px solid #E9EAEB"
            w="25%"
            p="12px">
            <Box
              borderRadius="8px"
              w="100%"
              h="100%"
              overflow="hidden">
              <GoogleMap />
            </Box>
          </Box>

          <Box
            borderRight="1px solid #E9EAEB"
            w="25%">
            <Text
              p="18px 16px"
              fontWeight={"600"}
              fontSize={"18px"}
              color={"#181D27"}
              borderBottom="1px solid #E9EAEB">
              Quotes (Rates)
            </Text>
            <Quotes tripDetails={tripDetails} />
          </Box>

          <Box
            w="25%"
            borderRight="1px solid #E9EAEB">
            <Text
              p="18px 20px"
              fontWeight={"600"}
              fontSize={"18px"}
              color={"#181D27"}
              borderBottom="1px solid #E9EAEB">
              Documents
            </Text>

            <Box
              id="scrollbar_none"
              h="280px"
              scrollbarWidth={"none"}
              scrollbarColor={"none"}
              overflowY={"scroll"}>
              {tripDetails?.documents?.map((item) => (
                <Documents
                  tripDetails={tripDetails}
                  item={item} />
              ))}
            </Box>
          </Box>

          <Box w="25%">
            <Text
              p="18px 20px"
              fontWeight={"600"}
              fontSize={"18px"}
              color={"#181D27"}
              borderBottom="1px solid #E9EAEB"
              borderRight="1px solid #E9EAEB">
              Dispatch Notes
            </Text>

            {tripDetails?.dispatch_notes?.map((el) => (
              <DispatchNotes item={el} />
            ))}
          </Box>
        </Flex>

        <DoubleTable tripDetails={tripDetails} />
      </Box>
      <Activities tripDetails={tripDetails} />
    </>
  );
}

export default HistoryTripsTab;
