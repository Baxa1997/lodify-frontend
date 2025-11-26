import React, {useCallback, useRef, useState, useMemo, useEffect} from "react";
import GoogleMapReact from "google-map-react";
import styles from "../../style.module.scss";
import {Box, Text, Flex, Button} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

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

  // const formatTimeAgo = (timestamp) => {
  //   if (!timestamp) return "N/A";
  //   const now = new Date();
  //   const time = new Date(timestamp);
  //   const diffMs = now - time;
  //   const diffMins = Math.floor(diffMs / 60000);
  //   const diffSecs = Math.floor((diffMs % 60000) / 1000);

  //   if (diffMins > 0) {
  //     return `${diffMins} min ${diffSecs} sec ago`;
  //   }
  //   return `${diffSecs} sec ago`;
  // };

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
            {driver?.current_location}
          </Text>
        </Flex>

        <Button
          width="130px"
          bg="#EF6820"
          color="white"
          borderRadius="12px"
          border="2px solid #cc6c38"
          _hover={{bg: "#d45a1a"}}
          onClick={() => {
            onSendMessage(driver);
          }}
          fontSize="14px"
          fontWeight="600">
          Send Message
        </Button>
      </Box>
    </Box>
  );
};

const GoogleMapComponent = ({trucksData = []}) => {
  const navigate = useNavigate();
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const mapRef = useRef(null);

  const {center, zoom} = useMemo(() => {
    if (!trucksData || trucksData.length === 0) {
      return {center: {lat: 36.7783, lng: -119.4179}, zoom: 6};
    }

    const validTrucks = trucksData.filter(
      (truck) =>
        truck.lat && truck.long && !isNaN(truck.lat) && !isNaN(truck.long)
    );

    if (validTrucks.length === 0) {
      return {center: {lat: 36.7783, lng: -119.4179}, zoom: 6};
    }

    const lats = validTrucks.map((truck) => parseFloat(truck.lat));
    const lngs = validTrucks.map((truck) => parseFloat(truck.long));

    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);

    const avgLat = (minLat + maxLat) / 2;
    const avgLng = (minLng + maxLng) / 2;

    const latDiff = maxLat - minLat;
    const lngDiff = maxLng - minLng;
    const maxDiff = Math.max(latDiff, lngDiff);

    let calculatedZoom = 11;
    if (maxDiff > 0) {
      if (maxDiff > 50) {
        calculatedZoom = 4;
      } else if (maxDiff > 20) {
        calculatedZoom = 5;
      } else if (maxDiff > 10) {
        calculatedZoom = 6;
      } else if (maxDiff > 5) {
        calculatedZoom = 7;
      } else if (maxDiff > 2) {
        calculatedZoom = 8;
      } else if (maxDiff > 1) {
        calculatedZoom = 9;
      } else if (maxDiff > 0.5) {
        calculatedZoom = 10;
      } else if (maxDiff > 0.2) {
        calculatedZoom = 11;
      } else if (maxDiff > 0.1) {
        calculatedZoom = 12;
      } else {
        calculatedZoom = 13;
      }
    }

    const finalZoom = Math.max(calculatedZoom - 1, 6);

    return {
      center: {lat: avgLat || 36.7783, lng: avgLng || -119.4179},
      zoom: finalZoom,
    };
  }, [trucksData]);

  const onMapLoad = useCallback((map, maps) => {
    if (mapRef.current) {
      return;
    }
    mapRef.current = {map, maps};
  }, []);

  useEffect(() => {
    if (mapRef.current?.map && mapRef.current?.maps && trucksData?.length > 0) {
      const validTrucks = trucksData.filter(
        (truck) =>
          truck.lat && truck.long && !isNaN(truck.lat) && !isNaN(truck.long)
      );

      if (validTrucks.length > 0) {
        const bounds = new mapRef.current.maps.LatLngBounds();
        validTrucks.forEach((truck) => {
          bounds.extend(
            new mapRef.current.maps.LatLng(
              parseFloat(truck.lat),
              parseFloat(truck.long)
            )
          );
        });

        mapRef.current.map.fitBounds(bounds, {
          padding: {top: 50, right: 50, bottom: 50, left: 50},
        });
      }
    }
  }, [trucksData]);

  const handleMarkerClick = (driver) => {
    setSelectedDriver(driver);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedDriver(null);
  };

  const handleSendMessage = (driver) => {
    navigate(`/admin/collabrations`, {
      state: {
        tripId: driver?.driver?.guid,
        tripName: driver?.driver?.first_name + " " + driver?.driver?.last_name,
      },
    });
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
        defaultZoom={zoom}
        zoom={zoom}
        onGoogleApiLoaded={({map, maps}) => onMapLoad(map, maps)}
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
