import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Box,
  Text,
  VStack,
  HStack,
  Divider,
} from "@chakra-ui/react";
import {format, parseISO, isValid} from "date-fns";

const InspectionDetailsModal = ({isOpen, onClose, inspection}) => {
  if (!inspection) return null;

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, "MMMM d, yyyy 'at' h:mm a");
      }
    } catch (error) {
      console.error("Date formatting error:", error);
    }
    return dateString;
  };

  const formatSimpleDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, "MM/dd/yyyy");
      }
    } catch (error) {
      console.error("Date formatting error:", error);
    }
    return dateString;
  };

  const formatValue = (value) => {
    if (value === null || value === undefined || value === "") return "N/A";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if(value === 'true') return "Yes";
    if(value === 'false') return "No";
    return String(value);
  };

  const DetailRow = ({label, value}) => (
    <HStack justify="space-between" align="flex-start" py="8px">
      <Text fontSize="14px" fontWeight="500" color="#6B7280" minW="180px">
        {label}:
      </Text>
      <Text fontSize="14px" fontWeight="400" color="#181D27" textAlign="right" flex="1">
        {value}
      </Text>
    </HStack>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay bg="rgba(0, 0, 0, 0.5)" />
      <ModalContent
        bg="white"
        borderRadius="12px"
        boxShadow="0px 4px 20px rgba(0, 0, 0, 0.15)"
        maxH="90vh"
        overflow="hidden">
        <ModalHeader
          borderBottom="1px solid #E2E8F0"
          pb={2}
          fontSize="20px"
          fontWeight="600"
          color="#181D27">
          Inspection Details
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody overflowY="auto" py={4} px={6}>
          <VStack spacing={4} align="stretch">
            {/* Basic Information */}
            <Box>
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb={2}>
                Basic Information
              </Text>
              <VStack spacing={0} align="stretch">
                <DetailRow label="Report Number" value={formatValue(inspection.report_number)} />
                <Divider />
                <DetailRow label="Inspection Date" value={formatSimpleDate(inspection.insp_date)} />
                <Divider />
                <DetailRow label="DOT Number" value={formatValue(inspection.dot_number)} />
                <Divider />
                <DetailRow label="Unique ID" value={formatValue(inspection.unique_id)} />
                <Divider />
                <DetailRow label="Time Weight" value={formatValue(inspection.time_weight)} />
              </VStack>
            </Box>

            {/* Vehicle Information */}
            <Box>
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb={2}>
                Vehicle Information
              </Text>
              <VStack spacing={0} align="stretch">
                <DetailRow label="VIN" value={formatValue(inspection.vin)} />
                <Divider />
                <DetailRow label="Unit License" value={formatValue(inspection.unit_license)} />
                <Divider />
                <DetailRow label="Unit Make" value={formatValue(inspection.unit_make)} />
              </VStack>
            </Box>

            {/* Violations */}
            <Box>
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb={2}>
                Violations
              </Text>
              <VStack spacing={0} align="stretch">
                <DetailRow label="Basic Violations" value={formatValue(inspection.basic_viol)} />
                <Divider />
                <DetailRow label="Out of Service Total" value={formatValue(inspection.oos_total)} />
              </VStack>
            </Box>

            {/* Inspection Types */}
            <Box>
              <Text fontSize="16px" fontWeight="600" color="#181D27" mb={2}>
                Inspection Types
              </Text>
              <VStack spacing={0} align="stretch">
                <DetailRow
                  label="Driver Fitness Inspection"
                  value={formatValue(inspection.dr_fitness_insp)}
                />
                <Divider />
                <DetailRow
                  label="Fatigued Inspection"
                  value={formatValue(inspection.fatigued_insp)}
                />
                <Divider />
                <DetailRow label="HM Inspection" value={formatValue(inspection.hm_insp)} />
                <Divider />
                <DetailRow
                  label="Substance/Alcohol Inspection"
                  value={formatValue(inspection.subt_alcohol_insp)}
                />
                <Divider />
                <DetailRow label="Unsafe Inspection" value={formatValue(inspection.unsafe_insp)} />
                <Divider />
                <DetailRow
                  label="Vehicle Maintenance Inspection"
                  value={formatValue(inspection.vh_maint_insp)}
                />
              </VStack>
            </Box>

          
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default InspectionDetailsModal;
