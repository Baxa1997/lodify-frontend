import styles from "./styles.module.scss";
import { Box, Button, Text, HStack, VStack, Flex } from "@chakra-ui/react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useMainInfoProps } from "./useMainInfoProps";
import StarRating from "@components/Rating";

export const MainInfo = ({ generalInfo }) => {

  const  {
    getTypeImage,
    companyData,
  } = useMainInfoProps();

  const {
    ownbus_16,
    owncoach,
    ownlimo_1_8,
    ownlimo_9_15,
    ownlimo_16,
    ownschool_1_8,
    ownschool_9_15,
    ownschool_16,
    owntract,
    ownvan_1_8,
    ownvan_9_15,
    trmbus_16,
    trmcoach,
    trmlimo_1_8,
    trmlimo_9_15,
    trmlimo_16,
    trmschool_1_8,
    trmschool_9_15,
    trmschool_16,
    trmtract,
    trmtrail,
    trmtruck,
    trmvan_1_8,
    trmvan_9_15,
    trpbus_16,
    trpcoach,
    trplimo_1_8,
    trplimo_9_15,
    trplimo_16,
    trpschool_1_8,
    trpschool_9_15,
    trpschool_16,
    trptract,
    trptrail,
    trptruck,
    trpvan_1_8,
    trpvan_9_15,
  } = generalInfo?.equipment_id_data || {};

  const uncategorizedCount = [
    ownbus_16,
    owncoach,
    ownlimo_1_8,
    ownlimo_9_15,
    ownlimo_16,
    ownschool_1_8,
    ownschool_9_15,
    ownschool_16,
    owntract,
    ownvan_1_8,
    ownvan_9_15,
    trmbus_16,
    trmcoach,
    trmlimo_1_8,
    trmlimo_9_15,
    trmlimo_16,
    trmschool_1_8,
    trmschool_9_15,
    trmschool_16,
    trmtract,
    trmtrail,
    trmtruck,
    trmvan_1_8,
    trmvan_9_15,
    trpbus_16,
    trpcoach,
    trplimo_1_8,
    trplimo_9_15,
    trplimo_16,
    trpschool_1_8,
    trpschool_9_15,
    trpschool_16,
    trptract,
    trptrail,
    trptruck,
    trpvan_1_8,
    trpvan_9_15,
  ].reduce((a, b) => Number(a) + Number(b), 0);

  const metrics = [
    {
      label: "Common",
      value: generalInfo.phone,
      status: "success",
    },
    {
      label: "Broker",
      value: generalInfo.broker_stat === "N" ? "Inactive" : "Active",
      status: generalInfo.broker_stat === "N" ? "error" : "success",
    },
    {
      label: "Safety Rating",
      value: generalInfo.safety_rating,
      status: generalInfo.safety_rating !== "None" ? "success" : "error",
    },
    // {
    //   label: "ELD",
    //   value: generalInfo.phone,
    //   status: "success",
    // },
    // {
    //   label: "Contract",
    //   value: generalInfo.phone,
    //   status: "success",
    // },
    {
      label: "Operating Status",
      value: generalInfo?.companies_id_data?.operating_status,
      status: "success",
    },
    // {
    //   label: "Certifications",
    //   value: generalInfo.phone,
    //   status: "success",
    // },
    // {
    //   label: "TIN",
    //   value: generalInfo.phone,
    //   status: "success",
    // },
  ];

  const powerUnits = [
    {
      title: "Power Units",
      count: generalInfo?.power_units,
    },
    // {
    //   title: "Dry Van",
    //   count: "9",
    // },
    {
      title: "Uncategorized",
      count: uncategorizedCount,
    },
    {
      title: "Box Trucks",
      count: generalInfo?.equipment_id_data?.truck_units,
    },
    // {
    //   title: "Flat Bed",
    //   count: "670",
    // },
    // {
    //   title: "Heavy Haul",
    //   count: "670",
    // },
    // {
    //   title: "Low Boy",
    //   count: "670",
    // },
  ];

  const verifiedCarrierResources = [
    {
      title: "Power Units",
      count: generalInfo?.power_units,
    },
    {
      title: "Drivers",
      count: generalInfo?.drivers,
    },
    {
      title: "Trailers",
      count: generalInfo?.equipment_id_data?.owntrail,
    },
    {
      title: "Box Trucks",
      count: generalInfo?.equipment_id_data?.truck_units,
    },
  ];

  return (
    <Box className={styles.container}>
      <Box className={styles.headerSection}>
        <Box className={styles.companyHeader}>
          <VStack
            align="flex-start"
            spacing={3}
          >
            {/* <StarRating
              value={companyData.rating}
              size={20}
            /> */}
            <Text
              fontSize="24px"
              fontWeight="bold"
              color="gray.800"
            >
              {generalInfo.legal_name}
            </Text>
            <Text
              fontSize="14px"
              color="gray.600"
            >
              DOT {generalInfo.dot_number} / {generalInfo.docket_number}
            </Text>
          </VStack>
          {/* <Button
            bg="#F97316"
            color="white"
            _hover={{ bg: "#EA580C" }}
            px={4}
            py={3}
            borderRadius="8px"
            fontSize="14px"
            fontWeight="600"
          >
            Connect Carrier
          </Button> */}
        </Box>

        <Box className={styles.contactsSection}>
          <Text
            fontSize="16px"
            fontWeight="400"
            mb={"16px"}
            color="#535862"
          >
            Dispatch Contacts
          </Text>
          <VStack
            align="flex-start"
            flexDir={"row"}
            spacing={"24px"}
          >
            <HStack spacing={3}>
              <img
                src="/img/phone.svg"
                alt="phone"
              />
              <Text
                fontSize="14px"
                color="#181D27"
                fontWeight="500"
              >
                {generalInfo.phone}
              </Text>
            </HStack>
            <HStack spacing={3}>
              <img
                src="/img/mailpin.svg"
                alt="mail"
              />
              <Text
                fontSize="14px"
                color="#181D27"
                fontWeight="500"
              >
                {generalInfo.email}
              </Text>
            </HStack>
            <HStack spacing={3}>
              <img
                src="/img/markerPin.svg"
                alt="map"
              />
              <Text
                fontSize="14px"
                color="#181D27"
                fontWeight="500"
              >
                {generalInfo.physical_address}
              </Text>
            </HStack>
          </VStack>
        </Box>

        <Box className={styles.metricsSection}>
          <Box
            display="grid"
            gridTemplateColumns="repeat(4, 1fr)"
            gap="6px"
            bg="white"
            borderRadius="12px"
          >
            {metrics.map((metric, index) => (
              <Flex
                key={index}
                alignItems="center"
                gap="6px"
                flexGrow={1}
              >
                <Flex
                  flexDir={"row"}
                  alignItems="center"
                  gap="6px"
                >
                  <Text
                    h="20px"
                    fontSize="14px"
                    color="#535862"
                    whiteSpace="nowrap"
                  >
                    {metric.label}:
                  </Text>
                  <Text
                    h="20px"
                    fontSize="14px"
                    fontWeight="500"
                    color="#181D27"
                  >
                    {metric.value}
                  </Text>
                </Flex>
                <StatusIcon status={metric.status} />
              </Flex>
            ))}
          </Box>
        </Box>

        <Flex
          borderBottom="1px solid #E9EAEB"
          p="16px"
        >
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gap="12px"
            width="100%"
          >
            {powerUnits.map((unit, index) => (
              <Flex
                key={index}
                bg="#EAF9F4"
                borderRadius="8px"
                border="1px solid #E9EAEB"
                justifyContent="space-between"
                p="14px 14px 14px 16px"
              >
                <Box>
                  <Text
                    color="#535862"
                    fontSize="16px"
                  >
                    {unit.title}
                  </Text>
                  <Text
                    color="#181D27"
                    fontSize="22px"
                    fontWeight="500"
                  >
                    {unit.count}
                  </Text>
                </Box>
                <Box>{getTypeImage(unit.title)}</Box>
              </Flex>
            ))}
          </Box>
        </Flex>

        <Box
          borderBottom="1px solid #E9EAEB"
          p="16px"
        >
          <Text
            mb="16px"
            fontSize={"16px"}
            color="#181D27"
            fontWeight={600}
          >
            Verified Carrier Resources on Lodify
          </Text>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gap="12px"
            width="100%"
          >
            {verifiedCarrierResources.map((unit, index) => (
              <Flex
                key={index}
                bg="#EAF9F4"
                borderRadius="8px"
                border="1px solid #E9EAEB"
                justifyContent="space-between"
                p="14px 14px 14px 16px"
              >
                <Box>
                  <Text
                    color="#535862"
                    fontSize="16px"
                  >
                    {unit.title}
                  </Text>
                  <Text
                    color="#181D27"
                    fontSize="22px"
                    fontWeight="500"
                  >
                    {unit.count}
                  </Text>
                </Box>
                <Box>{getTypeImage(unit.title)}</Box>
              </Flex>
            ))}
          </Box>
        </Box>

        {/* <Box
          borderBottom="1px solid #E9EAEB"
          p="16px"
        >
          <Text
            mb="16px"
            fontSize={"16px"}
            color="#181D27"
            fontWeight={600}
          >
            Carrier’s Performance Score on Lodify
          </Text>
          <Box
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(167px, 1fr))"
            gap="12px"
            width="100%"
          >
            <Box
              h="128px"
              p="20px"
              gridColumn="span 2"
              border="1px solid #E9EAEB"
              borderRadius="12px"
            >
              <Text
                color="#181D27"
                fontWeight={500}
                fontSize="14px"
              >
                Overall
              </Text>
              <Flex
                mb="8px"
                gap="12px"
              >
                <Text
                  color="#181D27"
                  fontSize="20px"
                  fontWeight={560}
                >
                  99%
                </Text>
                <Flex
                  justifyContent="center"
                  alignItems="center"
                  w="50px"
                  h="32px"
                  bg="#DCFAE6"
                  border="1px solid #ABEFC6"
                  borderRadius="4px"
                  color="#079455"
                  fontWeight={600}
                  fontSize={"22px"}
                >
                  A
                </Flex>
              </Flex>
              <Flex
                color="#175CD3"
                gap="4px"
              >
                <img
                  src="/img/questionRound.svg"
                  alt="info"
                />
                <Text
                  color="#175CD3"
                  fontSize="14px"
                  fontWeight={600}
                >
                  How is my grade calculated?
                </Text>
              </Flex>
            </Box>

            <Box
              h="128px"
              p="20px"
              border="1px solid #E9EAEB"
              borderRadius="12px"
            >
              <Flex
                alignItems="center"
                gap="4px"
                h="20px"
                mb="8px"
              >
                <Text
                  color="#181D27"
                  fontWeight={500}
                  fontSize="14px"
                >
                  On time
                </Text>
                <img
                  src="/img/info.svg"
                  alt="info"
                  width="20px"
                  height="20px"
                />
              </Flex>
              <Flex
                mb="8px"
                gap="12px"
                h="32px"
              >
                <Text
                  color="#181D27"
                  fontSize="20px"
                  fontWeight={560}
                >
                  100.00%
                </Text>
              </Flex>
              <Flex
                color="#175CD3"
                gap="4px"
              >
                <Text>0.0%</Text>
                <Text>1 week</Text>
              </Flex>
            </Box>

            <Box
              h="128px"
              p="20px"
              border="1px solid #E9EAEB"
              borderRadius="12px"
            >
              <Flex
                alignItems="center"
                gap="4px"
                h="20px"
                mb="8px"
              >
                <Text
                  color="#181D27"
                  fontWeight={500}
                  fontSize="14px"
                >
                  Acceptance
                </Text>
                <img
                  src="/img/info.svg"
                  alt="info"
                  width="20px"
                  height="20px"
                />
              </Flex>
              <Flex
                mb="8px"
                gap="12px"
                h="32px"
              >
                <Text
                  color="#181D27"
                  fontSize="20px"
                  fontWeight={560}
                >
                  100.00%
                </Text>
              </Flex>
              <Flex
                color="#175CD3"
                gap="4px"
              >
                <Text>0.0%</Text>
                <Text>1 week</Text>
              </Flex>
            </Box>

            <Box
              h="128px"
              p="20px"
              border="1px solid #E9EAEB"
              borderRadius="12px"
            >
              <Flex
                alignItems="center"
                gap="4px"
                h="20px"
                mb="8px"
              >
                <Text
                  color="#181D27"
                  fontWeight={500}
                  fontSize="14px"
                >
                  App usage
                </Text>
                <img
                  src="/img/info.svg"
                  alt="info"
                  width="20px"
                  height="20px"
                />
              </Flex>
              <Flex
                mb="8px"
                gap="12px"
                h="32px"
              >
                <Text
                  color="#181D27"
                  fontSize="20px"
                  fontWeight={560}
                >
                  100.00%
                </Text>
              </Flex>
              <Flex
                color="#175CD3"
                gap="4px"
              >
                <Text>0.0%</Text>
                <Text>1 week</Text>
              </Flex>
            </Box>

            <Box
              h="128px"
              p="20px"
              border="1px solid #E9EAEB"
              borderRadius="12px"
            >
              <Flex
                alignItems="center"
                gap="4px"
                h="20px"
                mb="8px"
              >
                <Text
                  color="#181D27"
                  fontWeight={500}
                  fontSize="14px"
                >
                  Disruption free
                </Text>
                <img
                  src="/img/info.svg"
                  alt="info"
                  width="20px"
                  height="20px"
                />
              </Flex>
              <Flex
                mb="8px"
                gap="12px"
                h="32px"
              >
                <Text
                  color="#181D27"
                  fontSize="20px"
                  fontWeight={560}
                >
                  100.00%
                </Text>
              </Flex>
              <Flex
                color="#175CD3"
                gap="4px"
              >
                <Text>0.0%</Text>
                <Text>1 week</Text>
              </Flex>
            </Box>
          </Box>
        </Box> */}

        {/* <Flex
          p="16px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex gap="6px">
            <img
              src="/img/reportFraud.svg"
              alt=""
            />
            <Text
              fontSize="16px"
              fontWeight="600"
              color="#535862"
            >
              Report Fraud
            </Text>
          </Flex>

          <Flex gap="12px">
            <Button
              _hover={{
                bg: "none",
              }}
              bg="none"
              border="1px solid #D5D7DA"
              borderRadius="8px"
              px="16px"
              py="8px"
            >
              Report Fraud
            </Button>
            <Button
              _hover={{
                bg: "none",
              }}
              color="#16B364"
              bg="#EDFCF2"
              border="1px solid #16B364"
              borderRadius="8px"
              px="16px"
              py="8px"
            >
              Connected
            </Button>
          </Flex>
        </Flex> */}
      </Box>
    </Box>
  );
};


const StatusIcon = ({ status }) => {
  return status === "success" ? (
    <Flex
      w="17px"
      h="17px"
      borderRadius="50%"
      bg="#EDFCF2"
      justifyContent="center"
      alignItems="center"
    >
      <FaCheck
        color="#22C55E"
        size={12}
      />
    </Flex>
  ) : (
    <Flex
      w="17px"
      h="17px"
      borderRadius="50%"
      bg="#FFEBEA"
      justifyContent="center"
      alignItems="center"
    >
      <FaTimes
        color="#FF3B30"
        size={12}
      />
    </Flex>
  );
};

