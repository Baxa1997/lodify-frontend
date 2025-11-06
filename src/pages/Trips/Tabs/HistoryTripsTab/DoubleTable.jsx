import React from "react";
import { Box, Text, VStack, HStack, Input, Link } from "@chakra-ui/react";

const tableHeadings = [
  { label: "", key: "count" },
  { label: "ORIGIN", key: "origin" },
  { label: "", key: "arrow" },
  { label: "STOP", key: "stop" },
  { label: "DEADHEAD", key: "deadhead" },
  { label: "DESTINATION", key: "destination" },
  { label: "RATE", key: "rate" },
  { label: "ACCESSORIALS", key: "accessorials" },
  { label: "ASSIGNEES", key: "assignees" },
];

const gridTemplate = "35px 1.3fr 35px 1.3fr 1fr 1fr 1fr 1fr 1.2fr";

function DoubleTable({ tripDetails = {} }) {
  const detailedStopsHeadings = [
    { label: "", key: "counts" },
    { label: "Address", key: "address" },
    { label: "", key: "count" },
    { label: "Appt time", key: "apptTime" },
    { label: "BOL#", key: "bol" },
    { label: "Phone #", key: "phone" },
    { label: "Load/Equipment", key: "loadEquipment" },
    { label: "Weight", key: "weight" },
    { label: "Qty", key: "qty" },
    { label: "Load size", key: "loadSize" },
    { label: "Special Instruction for driver", key: "specialInstruction" },
  ];

  const detailedGridTemplate =
    "35px 1.3fr 35px 1fr 0.8fr 1.1fr 1.2fr 0.6fr 0.6fr 0.8fr 1.2fr";

  return (
    <Box
      m="16px"
      borderRadius="12px"
      overflow="hidden"
      border="1px solid #E9EAEB"
      bg="white"
      shadow="sm">
      <Box
        display="grid"
        gridTemplateColumns={gridTemplate}
        borderBottom="1px solid #E9EAEB"
        bg="#FAFAFA"
        px="16px"
        py="10px"
        alignItems="center">
        {tableHeadings.map((heading) => (
          <Text
            key={heading.key}
            fontSize="13px"
            fontWeight="600"
            color="gray.700">
            {heading.label}
          </Text>
        ))}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns={gridTemplate}
        borderBottom="1px solid #E9EAEB"
        px="12px"
        py="14px"
        alignItems="center"
        fontSize="14px">
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Box
            w="20px"
            h="20px"
            bg="#22C55E"
            borderRadius="50%"
            color="white"
            fontSize="12px"
            fontWeight="600"
            display="flex"
            alignItems="center"
            justifyContent="center">
            1
          </Box>
        </Box>

        <VStack
          align="start"
          spacing={0}>
          <Text fontWeight="600">{tripDetails?.origin?.[0]?.address}</Text>
          <Text
            fontSize="12px"
            color="gray.600">
            {tripDetails?.origin?.[0]?.date}, {tripDetails?.origin?.[0]?.time}
          </Text>
        </VStack>

        <Box
          display="flex"
          alignItems="center"
          justifyContent="center">
          <Text fontSize="16px">→</Text>
        </Box>

        <VStack
          align="start"
          spacing={0}>
          <Text fontWeight="600">{tripDetails?.stops?.[0]?.address}</Text>
          <Text
            fontSize="12px"
            color="gray.600">
            {tripDetails?.stops?.[0]?.date}, {tripDetails?.stops?.[0]?.time}
          </Text>
        </VStack>

        <Text>15.00 mi</Text>

        <VStack
          align="start"
          spacing={0}>
          <Text>{tripDetails?.destination_mi || 0} mi</Text>
          <Text
            fontSize="12px"
            color="gray.600">
            10h 1m
            {/* SVOY */}
          </Text>
        </VStack>

        <VStack
          align="start"
          spacing={0}>
          <Text fontWeight="600">${tripDetails?.["o.rate"] || 0}</Text>
          <Text
            fontSize="12px"
            color="gray.600">
            $1.00/mi
          </Text>
        </VStack>

        <Text>{tripDetails?.accessorials || 0}</Text>
        <Text>{tripDetails?.assigness?.full_name || 0}</Text>
      </Box>

      <Box
        m="16px"
        borderRadius="12px"
        border="1px solid #E9EAEB">
        <Box
          display="grid"
          gridTemplateColumns={detailedGridTemplate}
          borderBottom="1px solid #E9EAEB"
          px="12px"
          py="14px"
          alignItems="center"
          fontSize="14px">
          <Box
            display="flex"
            alignItems="center">
            <Box
              w="20px"
              h="20px"
              bg="#22C55E"
              borderRadius="50%"
              color="white"
              fontSize="12px"
              fontWeight="600"
              display="flex"
              alignItems="center"
              justifyContent="center">
              1
            </Box>
          </Box>

          <VStack
            align="start"
            spacing={0}>
            <Text fontWeight="600">
              {tripDetails?.last_location_1?.[0]?.address || ""}
            </Text>
            {/* <Text fontSize="12px" color="gray.600">
              APT # BBAB20816
            </Text> */}
          </VStack>

          <Box
            display="flex"
            alignItems="center"
            justifyContent="center">
            <Text fontSize="16px">→</Text>
          </Box>

          <VStack
            align="start"
            spacing={0}>
            <Text fontWeight="600">
              {tripDetails?.last_location_2?.[0]?.address || "No Address"}
            </Text>
            {/* <Text fontSize="12px" color="gray.600">
              APT # BBAB20816
            </Text> */}
          </VStack>

          <Input
            size="sm"
            defaultValue="15"
            w="70px"
            fontSize="13px"
            borderColor="#E9EAEB"
          />

          <Input
            size="sm"
            defaultValue="987..."
            w="90px"
            fontSize="13px"
            borderColor="#E9EAEB"
          />

          <Input
            size="sm"
            defaultValue="$1000"
            w="90px"
            fontSize="13px"
            borderColor="#E9EAEB"
          />
          <Text color="gray.400">-</Text>

          <Text>-</Text>
          <Text>-</Text>
          <Text>{tripDetails?.assigness?.full_name || ""}</Text>
        </Box>

        <Box
          display="grid"
          gridTemplateColumns={detailedGridTemplate}
          borderBottom="1px solid #E9EAEB"
          bg="#FAFAFA"
          px="12px"
          py="13px"
          alignItems="center">
          {detailedStopsHeadings.map((heading) => (
            <Text
              key={heading.key}
              fontSize="11px"
              fontWeight="500"
              color="gray.700">
              {heading.label}
            </Text>
          ))}
        </Box>

        {tripDetails?.trips?.map((stop) => (
          <Box
            display="grid"
            gridTemplateColumns={detailedGridTemplate}
            borderBottom="1px solid #E9EAEB"
            px="12px"
            py="14px"
            alignItems="center"
            fontSize="14px">
            <HStack align="start">
              <Box
                w="20px"
                h="20px"
                bg="#22C55E"
                borderRadius="50%"
                color="white"
                fontSize="12px"
                fontWeight="600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={2}>
                1
              </Box>
            </HStack>

            <HStack align="start">
              <VStack
                align="start"
                spacing={0}>
                <Text>{stop?.address}</Text>
                <Text
                  fontSize="12px"
                  color="gray.600">
                  {`${stop?.city ?? ""}, ${stop?.state ?? ""}, ${
                    stop?.zip_code ?? ""
                  }`}{" "}
                </Text>
              </VStack>
            </HStack>

            <HStack align="start">
              <Box
                w="20px"
                h="20px"
                bg="#22C55E"
                borderRadius="50%"
                color="white"
                fontSize="12px"
                fontWeight="600"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mr={2}>
                2
              </Box>
            </HStack>

            <HStack align="start">
              <Text>
                {stop?.date}, {stop?.time}
              </Text>
            </HStack>

            <Text color="gray.400">{stop?.bol}</Text>
            <Text color="gray.400">{stop?.phone}</Text>

            <VStack
              align="start"
              spacing={0}>
              <Text>{stop?.load_type?.[0]}</Text>
              <Text
                fontSize="12px"
                color="gray.600">
                {stop?.equipment_type?.[0]}
              </Text>
            </VStack>

            <Text>{stop?.weight}</Text>

            <VStack
              align="start"
              spacing={0}>
              <Text>{stop?.quantity}</Text>
              <Text
                fontSize="12px"
                color="gray.600">
                Tarps: No
              </Text>
            </VStack>

            <Text color="gray.400">{stop?.load_size}</Text>
            <Text color="gray.400">{stop?.instruction_for_driver}</Text>
          </Box>
        ))}

        <Box
          bg="#FAFAFA"
          p={4}>
          <HStack
            justify="space-between"
            align="center"
            spacing={8}>
            <Text
              fontSize="13px"
              color="gray.700">
              Remit payment to{" "}
              <Link
                color="blue.500"
                fontSize="13px"
                fontWeight="500">
                {tripDetails?.remit_payment_to || ""}
              </Link>
            </Text>
            <Text
              fontSize="13px"
              color="gray.700">
              Created on{" "}
              <Link
                color="blue.500"
                fontSize="13px"
                fontWeight="500">
                {tripDetails?.created_at || ""}
              </Link>
            </Text>
            <Text
              fontSize="13px"
              color="gray.700">
              Booked by{" "}
              <Link
                color="blue.500"
                fontSize="13px"
                fontWeight="500">
                {tripDetails?.booked_by?.full_name || ""}
              </Link>
            </Text>
            <Text
              fontSize="13px"
              color="gray.700">
              Last Updated{" "}
              <Link
                color="blue.500"
                fontSize="13px"
                fontWeight="500">
                {tripDetails?.updated_at || ""}
              </Link>
            </Text>
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}

export default DoubleTable;
