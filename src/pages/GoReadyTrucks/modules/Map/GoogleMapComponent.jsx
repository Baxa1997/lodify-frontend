import React, {useCallback, useRef, useState, useMemo} from "react";
import GoogleMapReact from "google-map-react";
import styles from "../../style.module.scss";
import {Box, Text, Flex, Button} from "@chakra-ui/react";
import {FaTruck, FaMapMarkerAlt} from "react-icons/fa";
import {useQuery} from "@tanstack/react-query";
import goReadyTrucksService from "@services/goReadyTrucksService";
import {useSelector} from "react-redux";

const DriverMarker = ({onClick, driver}) => (
  <div className={styles.marker} onClick={onClick}>
    <Flex
      bg="#fff"
      minW="70px"
      h="30px"
      alignItems="center"
      justifyContent="center"
      borderRadius="6px"
      border="1px solid #E2E8F0"
      px="6px"
      fontSize="12px"
      fontWeight="600">
      {driver?.licence_plate ?? ""}
    </Flex>
    <img src="/img/TruckMarker.svg" alt="marker" />
    {driver?.tripId && (
      <div className={styles.markerLabel}>{driver.tripId}</div>
    )}
  </div>
);

const DriverInfoPopup = ({isOpen, onClose, driver, onSendMessage}) => {
  if (!isOpen || !driver) return null;

  const formatTimeAgo = (timestamp) => {
    if (!timestamp) return "N/A";
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    const diffSecs = Math.floor((diffMs % 60000) / 1000);

    if (diffMins > 0) {
      return `${diffMins} min ${diffSecs} sec ago`;
    }
    return `${diffSecs} sec ago`;
  };

  return (
    <Box className={styles.infoPopup}>
      <Box className={styles.popupHeader}>
        <Flex flexDirection="column">
          <Text fontWeight="600" color="#181D27">
            {driver.licence_plate || ""}
          </Text>
          <Text fontSize="12px" color="#414651">
            {`${driver.driver?.first_name || ""} ${
              driver.driver?.last_name || ""
            }`}
          </Text>
        </Flex>
        <Box className={styles.closeButton} onClick={onClose}>
          ×
        </Box>
      </Box>

      <Box className={styles.popupContent}>
        <Flex align="center" gap="8px" mb="12px">
          <img src="/img/modelYear.svg" alt="" />
          <Text className={styles.vehicleText} fontWeight="600" color="#414651">
            Model year: {driver.year || "N/A"}
          </Text>
        </Flex>

        <Flex align="center" gap="8px" mb="12px">
          <img src="/img/mapTruck.svg" alt="" />
          <Text
            className={styles.locationText}
            fontWeight="600"
            color="#414651">
            {driver.location || driver.address || "Location not available"}
          </Text>
        </Flex>

        <Text className={styles.lastUpdatedText} mb="12px">
          Last Verification{" "}
          {formatTimeAgo(driver.lastVerification || driver.timestamp)}
        </Text>

        <Button
          width="130px"
          bg="#EF6820"
          color="white"
          borderRadius="12px"
          border="2px solid #cc6c38"
          _hover={{bg: "#d45a1a"}}
          onClick={onSendMessage}
          fontSize="14px"
          fontWeight="600">
          Send Message
        </Button>
      </Box>
    </Box>
  );
};

const GoogleMapComponent = ({drivers = []}) => {
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const mapRef = useRef(null);
  const companiesId = useSelector(
    (state) => state.auth.user_data?.companies_id
  );

  const {data: trucksData} = useQuery({
    queryKey: ["TRUCKS_DATA"],
    queryFn: () => {
      return goReadyTrucksService.getTrucks({
        method: "get",
        object_data: {
          companies_id: companiesId,
        },
        table: "trucks_with_drivers",
      });
    },
    select: (data) => data?.data?.response || [],
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
  });

  const center = useMemo(() => {
    if (!trucksData || trucksData.length === 0) {
      return {lat: 36.7783, lng: -119.4179};
    }

    const validTrucks = trucksData.filter(
      (truck) =>
        truck.lat && truck.long && !isNaN(truck.lat) && !isNaN(truck.long)
    );

    if (validTrucks.length === 0) {
      return {lat: 36.7783, lng: -119.4179};
    }

    const avgLat =
      validTrucks.reduce((sum, truck) => sum + parseFloat(truck.lat), 0) /
      validTrucks.length;
    const avgLng =
      validTrucks.reduce((sum, truck) => sum + parseFloat(truck.long), 0) /
      validTrucks.length;

    return {lat: avgLat || 36.7783, lng: avgLng || -119.4179};
  }, [trucksData]);

  const onMapLoad = useCallback((map) => {
    if (mapRef.current) {
      return;
    }
    mapRef.current = map;
  }, []);

  const handleMarkerClick = (driver) => {
    setSelectedDriver(driver);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedDriver(null);
  };

  const handleSendMessage = () => {
    console.log("Send message to:", selectedDriver);
  };

  const hasTrucks = trucksData && trucksData.length > 0;

  return (
    <Box
      mt="20px"
      width="100%"
      height="calc(100vh - 320px)"
      borderRadius="12px"
      border="1px solid #E2E8F0"
      overflow="hidden"
      position="relative">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAdBRYyeH13KXV-VtXpQuG36A7vbBjibMU",
        }}
        defaultCenter={center}
        center={center}
        defaultZoom={hasTrucks ? 11 : 6}
        onGoogleApiLoaded={({map}) => onMapLoad(map)}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          mapTypeId: "roadmap",
        }}>
        {trucksData?.map((driver, index) => (
          <DriverMarker
            key={driver.id || driver.tripId || index}
            lat={driver.lat}
            lng={driver.long}
            driver={driver}
            onClick={() => handleMarkerClick(driver)}
          />
        ))}
      </GoogleMapReact>

      <DriverInfoPopup
        isOpen={showPopup}
        onClose={handleClosePopup}
        driver={selectedDriver}
        onSendMessage={handleSendMessage}
      />
    </Box>
  );
};

export default GoogleMapComponent;
