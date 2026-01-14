import React, { useState, useCallback, useRef, useEffect } from "react";
import { Box, Flex, Text, Badge, Icon, Button } from "@chakra-ui/react";
import GoogleMapReact from "google-map-react";
import { FaTachometerAlt, FaCar, FaCrosshairs } from "react-icons/fa";
import { format } from "date-fns";
import styles from "./LocationTab.module.scss";
import assetsService from "../../services/assetsService";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";

const LocationMarker = ({ lat, lng, onClick }) => (
  <div
    className={styles.marker}
    onClick={onClick}>
    <div className={styles.markerInner}>
      <div className={styles.markerDot}></div>
    </div>
  </div>
);

const InfoPopup = ({ isOpen, onClose, mapData }) => {
  if (!isOpen) return null;

  return (
    <Box className={styles.infoPopup}>
      <Box className={styles.popupHeader}>
        <Text className={styles.driverId}>{mapData?.number}</Text>
        <Box
          className={styles.closeButton}
          onClick={onClose}>
          ×
        </Box>
      </Box>

      <Box className={styles.popupContent}>
        <Text className={styles.driverName}>{mapData?.name || "Driver"}</Text>

        <Flex
          align="center"
          gap="8px"
          mb="12px">
          <Box className={styles.statusIndicator}></Box>
          <Text className={styles.statusText}>{mapData?.code}</Text>
        </Flex>

        <Flex
          align="center"
          gap="8px"
          mb="8px">
          <Icon
            as={FaTachometerAlt}
            color="#10B981" />
          <Text className={styles.speedText}>{mapData?.speed}</Text>
        </Flex>

        <Flex
          pb="8px"
          borderBottom="1px solid #E2E8F0"
          align="center"
          gap="8px"
          mb="8px">
          <Icon
            as={FaCar}
            color="#6B7280" />
          <Text className={styles.mileageText}>{mapData?.odometer}</Text>
        </Flex>

        <Flex
          align="center"
          gap="8px">
          <Text>Last updated:</Text>
          <Text className={styles.lastUpdatedText}>
            {mapData?.timestamp
              ? format(new Date(mapData?.timestamp), "MMM d, h:mm a")
              : "N/A"}
          </Text>
        </Flex>
      </Box>
    </Box>
  );
};

const LocationTab = () => {
  const location = useLocation();
  const asset = location.state?.asset;
  const [showInfoPopup, setShowInfoPopup] = useState(true);
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  const { data: mapData, isLoading: mapLoading } = useQuery({
    queryKey: ["MAP_INVOKE", location.state?.asset?.guid],
    queryFn: () =>
      assetsService.mapInovke({
        data: {
          companies_id: asset?.companies_id,
          external_key: asset?.external_key,
          asset_id: asset?.guid,
        },
      }),
    select: (data) => data?.data,
  });

  const parseCoordinate = (value) => {
    if (!value) return null;
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  };

  const latitude = parseCoordinate(mapData?.[0]?.lat);
  const longitude = parseCoordinate(mapData?.[0]?.lon);

  const onMapLoad = useCallback((map, maps) => {
    mapRef.current = map;
    
    // Draw polylines if response coordinates exist
    if (mapData?.response && Array.isArray(mapData.response)) {
      drawPolylines(map, maps, mapData.response);
    }
  }, [mapData]);

  // Function to draw polylines from coordinate arrays
  const drawPolylines = useCallback((map, maps, coordinateArrays) => {
    // Clear existing polyline if any
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    // Flatten and convert coordinates
    const allCoordinates = [];
    
    coordinateArrays.forEach((coordArray) => {
      if (Array.isArray(coordArray)) {
        coordArray.forEach((coord) => {
          if (Array.isArray(coord) && coord.length === 2) {
            // Coordinates are in format [lng, lat], convert to {lat, lng}
            allCoordinates.push({
              lat: coord[1],
              lng: coord[0]
            });
          }
        });
      }
    });

    if (allCoordinates.length > 0) {
      // Create polyline
      const polyline = new maps.Polyline({
        path: allCoordinates,
        geodesic: true,
        strokeColor: "#007BFF",
        strokeOpacity: 0.8,
        strokeWeight: 3,
      });

      polyline.setMap(map);
      polylineRef.current = polyline;

      // Fit map bounds to show all coordinates
      const bounds = new maps.LatLngBounds();
      allCoordinates.forEach((coord) => {
        bounds.extend(new maps.LatLng(coord.lat, coord.lng));
      });
      map.fitBounds(bounds);
    }
  }, []);

  // Redraw polylines when mapData changes
  useEffect(() => {
    if (mapRef.current && mapData?.response) {
      drawPolylines(mapRef.current, window.google.maps, mapData.response);
    }
  }, [mapData, drawPolylines]);

  const focusOnAssetLocation = useCallback(() => {
    if (
      mapRef.current &&
      latitude &&
      longitude &&
      latitude !== 0 &&
      longitude !== 0
    ) {
      mapRef.current.panTo({ lat: latitude, lng: longitude });
      mapRef.current.setZoom(15);
    }
  }, [latitude, longitude]);
  if (mapLoading) {
    return (
      <Box
        className={styles.mapContainer}
        display="flex"
        alignItems="center"
        justifyContent="center">
        <Text>Loading map data...</Text>
      </Box>
    );
  }

  if (!mapData || !mapData[0] || !latitude || !longitude) {
    return (
      <Box
        className={styles.mapContainer}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        gap="10px">
        <Text>No location data available for this asset</Text>
        <Text
          fontSize="sm"
          color="gray.500">
          Latitude: {mapData?.[0]?.latitude || "N/A"}, Longitude:{" "}
          {mapData?.[0]?.longitude || "N/A"}
        </Text>
      </Box>
    );
  }

  return (
    <Box className={styles.mapContainer}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAdBRYyeH13KXV-VtXpQuG36A7vbBjibMU",
        }}
        defaultCenter={{
          lat: latitude,
          lng: longitude,
        }}
        defaultZoom={11}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => onMapLoad(map, maps)}
        options={{
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
          zoomControl: true,
          mapTypeId: "roadmap",
        }}>
        <LocationMarker
          lat={latitude}
          lng={longitude}
          onClick={() => {
            setShowInfoPopup(true);
          }}
        />
      </GoogleMapReact>

      <Button
        className={styles.focusButton}
        onClick={focusOnAssetLocation}
        size="sm"
        width="40px"
        height="40px"
        borderRadius="none"
        variant="solid"
        backgroundColor="#fff"
        position="absolute"
        top="77%"
        right="10px"
        zIndex="10">
        <Icon
          fontSize="20px"
          color="#666666"
          as={FaCrosshairs} />
      </Button>

      <InfoPopup
        mapData={mapData?.[0]}
        isOpen={showInfoPopup}
        onClose={() => setShowInfoPopup(false)}
      />
    </Box>
  );
};

export default LocationTab;
