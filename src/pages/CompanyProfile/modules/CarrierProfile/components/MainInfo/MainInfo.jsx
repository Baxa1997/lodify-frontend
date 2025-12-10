import styles from "./styles.module.scss";
import {
  Box,
  Button,
  Text,
  HStack,
  VStack,
  Flex,
  Icon,
  useToast,
} from "@chakra-ui/react";
import {StarIcon} from "@chakra-ui/icons";
import {useSearchParams, useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useState} from "react";
import carrierService from "@services/carrierService";
import {PowerUnitsSection} from "./components/PowerUnitsSection";
import {VerifiedCarrierResourcesSection} from "./components/VerifiedCarrierResourcesSection";
import {CarriersPerformance} from "./components/CarriersPerformance";
import MetricsSection from "./components/MetricsSection";

export const MainInfo = ({generalInfo}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [isConnecting, setIsConnecting] = useState(false);
  const brokersId = useSelector((state) => state.auth.user_data?.brokers_id);
  const carrierId = searchParams.get("id");
  const {new_info} = generalInfo;
  console.log("new_info", new_info);
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

  const handleConnectCarrier = async () => {
    if (!carrierId || !brokersId) {
      toast({
        title: "Error",
        description: "Missing carrier ID or broker ID",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }

    setIsConnecting(true);
    const data = {
      joined_at: new Date().toISOString(),
      brokers_id: brokersId,
      companies_id: carrierId,
    };

    try {
      await carrierService.addCarrier(data);
      toast({
        title: "Carrier Connected Successfully!",
        description: "The carrier has been added to your list",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      navigate("/admin/carriers");
    } catch (error) {
      toast({
        title: "Failed to Connect Carrier",
        description: error?.response?.data?.message || "Please try again",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatIds = () => {
    const parts = [];
    if (new_info?.state) parts.push(new_info.state);
    if (new_info?.us_dot_number) parts.push(`DOT ${new_info.us_dot_number}`);
    if (new_info?.docket_number) parts.push(`${new_info.docket_number}`);
    if (new_info?.scac_code) parts.push(`SCAC - ${new_info.scac_code}`);
    return parts.join(" / ");
  };

  return (
    <Box className={styles.container}>
      <Box className={styles.headerSection}>
        <Box bg="white" borderBottom="1px solid #E2E8F0" mb="24px">
          <Flex justify="space-between" align="flex-start" mb="20px">
            <VStack align="flex-start" spacing="12px" flex="1">
              <HStack spacing="4px">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    as={StarIcon}
                    w="20px"
                    h="20px"
                    color="gold"
                    fill="currentColor"
                  />
                ))}
              </HStack>
              <Text fontSize="20px" fontWeight="700" color="#181D27">
                {new_info.legal_name || new_info.company_name || "N/A"}
              </Text>
              <Text fontSize="14px" color="#535862" fontWeight="400">
                {formatIds() || "N/A"}
              </Text>
            </VStack>
            {carrierId && (
              <Button
                bg="#EF6820"
                color="white"
                borderRadius="8px"
                px="24px"
                py="12px"
                fontSize="14px"
                fontWeight="600"
                _hover={{bg: "#D45A1A"}}
                isLoading={isConnecting}
                loadingText="Connecting..."
                onClick={handleConnectCarrier}>
                Connect Carrier
              </Button>
            )}
          </Flex>

          <Box borderTop="1px solid #E2E8F0" pt="20px">
            <Text fontSize="16px" fontWeight="400" mb="16px" color="#535862">
              Dispatch Contacts
            </Text>
            <VStack
              flexDirection={"row"}
              align="flex-start"
              gap="24px"
              pb="12px">
              {new_info.phone && (
                <HStack spacing={3}>
                  <img
                    src="/img/phone.svg"
                    alt="phone"
                    width="20px"
                    height="20px"
                  />
                  <Text fontSize="14px" color="#181D27" fontWeight="500">
                    {new_info?.phone}
                  </Text>
                </HStack>
              )}
              {new_info?.email && (
                <HStack spacing={3}>
                  <img
                    src="/img/mailpin.svg"
                    alt="mail"
                    width="20px"
                    height="20px"
                  />
                  <Text fontSize="14px" color="#181D27" fontWeight="500">
                    {new_info?.email}
                  </Text>
                </HStack>
              )}
              {new_info?.physical_address && (
                <HStack spacing={3}>
                  <img
                    src="/img/markerPin.svg"
                    alt="map"
                    width="20px"
                    height="20px"
                  />
                  <Text fontSize="14px" color="#181D27" fontWeight="500">
                    {new_info?.physical_address}
                  </Text>
                </HStack>
              )}
            </VStack>
          </Box>
        </Box>

        <Box className={styles.metricsSection}>
          <MetricsSection generalInfo={generalInfo} new_info={new_info} />
        </Box>
        <PowerUnitsSection
          generalInfo={generalInfo}
          uncategorizedCount={uncategorizedCount}
        />
        <Box borderBottom="1px solid #E9EAEB" p="16px 0">
          <Text mb="16px" fontSize={"16px"} color="#181D27" fontWeight={600}>
            Verified Carrier Resources on Lodify
          </Text>
          <VerifiedCarrierResourcesSection generalInfo={generalInfo} />
        </Box>
        <CarriersPerformance performanceData={generalInfo?.performance_data} />
      </Box>
    </Box>
  );
};
