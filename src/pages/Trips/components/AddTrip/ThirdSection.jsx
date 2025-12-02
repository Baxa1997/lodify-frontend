import {AddIcon, DeleteIcon} from "@chakra-ui/icons";
import {Box, Button, Flex, Text, HStack} from "@chakra-ui/react";
import {useState, useMemo} from "react";
import {useFieldArray, useWatch} from "react-hook-form";
import HFFilesField from "../../../../components/HFFilesField";
import HFTextField from "../../../../components/HFTextField";
import HFSelect from "../../../../components/HFSelect";
import Accessorials from "../Accessorials";
import AddReferenceModal from "./AddReferenceModal";

function ThirdSection({control}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {fields, append, remove} = useFieldArray({
    control,
    name: "new_references",
  });

  const tripPickups = useWatch({
    control,
    name: "trip_pickups",
    defaultValue: [],
  });

  const normalizeFieldType = (type) => {
    return Array.isArray(type) && type.length > 0 ? type[0]?.toLowerCase() : "";
  };

  const stopOptions = useMemo(() => {
    if (!tripPickups || tripPickups.length === 0) {
      return [{label: "No stops available", value: ""}];
    }

    return tripPickups?.map((pickup, index) => {
      const type = normalizeFieldType(pickup?.type || pickup?.stop_type);
      let label = "";

      if (type === "pickup") {
        label = `Pickup ${index + 1}`;
      } else if (type === "pickup and delivery") {
        label = `Pickup And Delivery ${index + 1}`;
      } else {
        label = `Delivery ${index + 1}`;
      }

      return {
        label,
        value: index + 1,
      };
    });
  }, [tripPickups]);

  const referenceTypeOptions = [
    {label: "PU #", value: "PU"},
    {label: "PO #", value: "PO"},
    {label: "Other #", value: "Other"},
  ];

  const handleAddReference = (referenceData) => {
    append(referenceData);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const watchedReferences = useWatch({
    control,
    name: "new_references",
    defaultValue: [],
  });

  return (
    <Box
      mt={"20px"}
      border="1px solid #E9EAEB"
      gap="24px"
      borderRadius="12px"
      p="24px">
      <Flex flexDirection="row" gap={"24px"}>
        <Flex w={"100%"} alignItems="center" gap="24px" flexDirection="column">
          <Text
            width={"100%"}
            textAlign="left"
            fontSize={"18px"}
            fontWeight={"600"}
            color={"#181D27"}>
            Reference #’s
          </Text>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              Reference #
            </Text>
            <HFTextField
              border={"1px solid #D5D7DA"}
              size="md"
              control={control}
              name="reference"
              placeholder="Enter Reference #"
            />
          </Box>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              PO # <span>*</span>
            </Text>
            <HFTextField
              border={"1px solid #D5D7DA"}
              size="md"
              control={control}
              name="reference_po"
              placeholder="Enter PO #"
            />
          </Box>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              Other #
            </Text>
            <HFTextField
              border={"1px solid #D5D7DA"}
              size="md"
              control={control}
              name="reference_other"
              placeholder="Enter Other #"
            />
          </Box>
        </Flex>
        <Flex w={"100%"} alignItems="center" gap="24px" flexDirection="column">
          <Text
            width={"100%"}
            textAlign="left"
            fontSize={"18px"}
            fontWeight={"600"}
            color={"#181D27"}>
            Payments
          </Text>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              Hauling Rate <span>*</span>
            </Text>
            <HFTextField
              border={"1px solid #D5D7DA"}
              size="md"
              control={control}
              name="hauling_rate"
              placeholder="Enter Payment"
            />
          </Box>
          <Box w={"100%"}>
            <Accessorials
              control={control}
              name="accessorials"
              label="Accessorials"
            />
          </Box>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              Lodify Verificaion Fee <span>*</span>
            </Text>
            <HFTextField
              disabled={true}
              size="md"
              border={"1px solid #D5D7DA"}
              control={control}
              name="service_fee"
              placeholder="Enter ServiceFee"
            />
          </Box>
        </Flex>
        <Flex w={"100%"} alignItems="center" gap="24px" flexDirection="column">
          <Text
            width={"100%"}
            textAlign="left"
            fontSize={"18px"}
            fontWeight={"600"}
            color={"#181D27"}>
            Documents
          </Text>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              Rate Confirmation <span>*</span>
            </Text>
            <HFFilesField
              size="md"
              border={"1px solid #D5D7DA"}
              control={control}
              name="rate_confirmation"
              placeholder="Enter BOL/POD"
            />
          </Box>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              BOL/POD
            </Text>
            <HFFilesField
              size="md"
              border={"1px solid #D5D7DA"}
              control={control}
              name="bold_pod"
              placeholder="Enter BOL/POD"
            />
          </Box>
          <Box w={"100%"}>
            <Text
              mb={"6px"}
              fontSize={"14px"}
              fontWeight={"500"}
              color={"#414651"}>
              Other Files
            </Text>
            <HFFilesField
              size="md"
              border={"1px solid #D5D7DA"}
              control={control}
              name="other_files"
              placeholder="Enter Other Files"
            />
          </Box>
        </Flex>
      </Flex>

      <Box mt="24px" display="flex" justifyContent="flex-start">
        <Button
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap="8px"
          border="1px solid #ffcaad"
          bg="#fff"
          _hover={{bg: "#fff"}}
          onClick={handleModalOpen}>
          <AddIcon w="16px" h="16px" color="#EF6820" />
          <Text color="#181D27">Reference</Text>
        </Button>
      </Box>

      <AddReferenceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        control={control}
        onAddReference={handleAddReference}
      />
    </Box>
  );
}

export default ThirdSection;
