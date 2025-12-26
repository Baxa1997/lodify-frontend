import React, {useMemo, useCallback, useState} from "react";
import GoogleMapReact from "google-map-react";
import tripsService from "@services/tripsService";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import {Box, Spinner, Text, Flex, Button} from "@chakra-ui/react";
import ReactDOMServer from "react-dom/server";

const StopPoint = ({index}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <circle
        cx="8"
        cy="8"
        r="7"
        fill="#1570EF"
        stroke="#FFFFFF"
        strokeWidth="2"
      />
      <text
        x="8"
        y="11"
        textAnchor="middle"
        fontSize="9"
        fontWeight="bold"
        fontFamily="Arial, sans-serif"
        fill="#fff">
        {index}
      </text>
    </svg>
  );
};

// Location Info Popup Component
const LocationInfoPopup = ({
  isOpen,
  onClose,
  locationType,
  locationData,
  coordinates,
}) => {
  if (!isOpen || !locationData) return null;

  const locationName =
    locationType === "eld" ? "ELD Location" : "Lodify Location";

  return (
    <Box
      position="absolute"
      bottom="20px"
      left="20px"
      right="20px"
      maxW="400px"
      bg="white"
      borderRadius="12px"
      boxShadow="0 4px 12px rgba(0,0,0,0.15)"
      zIndex="1000"
      border="1px solid #E2E8F0">
      <Box
        p="8px 16px"
        borderBottom="1px solid #E2E8F0"
        display="flex"
        justifyContent="space-between"
        alignItems="center">
        <Flex flexDirection="column">
          <Text fontWeight="600" color="#181D27" fontSize="16px">
            {locationName}
          </Text>
          <Text fontSize="12px" color="#414651" mt="4px">
            Truck Location
          </Text>
        </Flex>
        <Box
          onClick={onClose}
          cursor="pointer"
          fontSize="24px"
          color="#414651"
          _hover={{color: "#181D27"}}
          lineHeight="1">
          ×
        </Box>
      </Box>

      <Box p="16px">
        {/* <Flex align="center" gap="8px" mb="12px">
          <img src="/img/mapTruck.svg" alt="location" width="20" height="20" />
          <Text fontWeight="600" color="#414651" fontSize="14px">
            Coordinates: {locationData}
          </Text>
        </Flex> */}

        {coordinates && (
          <>
            <Flex align="center" gap="8px" mb="12px">
              <img
                src="/img/modelYear.svg"
                alt="coordinates"
                width="20"
                height="20"
              />
              <Text fontWeight="600" color="#414651" fontSize="14px">
                Latitude: {coordinates.lat.toFixed(6)}
              </Text>
            </Flex>

            <Flex align="center" gap="8px" mb="12px">
              <img
                src="/img/modelYear.svg"
                alt="coordinates"
                width="20"
                height="20"
              />
              <Text fontWeight="600" color="#414651" fontSize="14px">
                Longitude: {coordinates.lng.toFixed(6)}
              </Text>
            </Flex>
          </>
        )}
      </Box>
    </Box>
  );
};

const TruckMarker = ({lat, lng, label}) => {
  return (
    <Box
      position="absolute"
      transform="translate(-50%, -100%)"
      textAlign="center">
      {label && (
        <Box
          mb="4px"
          bg="#fff"
          minW="70px"
          h="30px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderRadius="6px"
          border="1px solid #E2E8F0"
          px="6px"
          fontSize="12px"
          fontWeight="600"
          boxShadow="0 2px 4px rgba(0,0,0,0.2)">
          {label}
        </Box>
      )}
      <img
        src="/img/TruckMarker.svg"
        alt="truck marker"
        style={{
          width: "40px",
          height: "auto",
          filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
        }}
      />
    </Box>
  );
};

function GoogleLiveComponent({
  latitude,
  longitude,
  showMarkers = true,
  showAllStops = false,
  lineColor = "#007BFF",
  startIcon = "/img/map-point.svg",
  endIcon = "/img/map-point-red.svg",
  stopIcon = "/img/point.svg",
  locationStatus = {},
}) {
  const envId = useSelector((state) => state.auth.environmentId);
  const {id} = useParams();
  const [selectedLocation, setSelectedLocation] = useState(null);

  const parseCoordinates = useCallback((coordString) => {
    if (!coordString) return null;
    const parts = coordString.split(",");
    if (parts.length !== 2) return null;

    const lat = parseFloat(parts[0]?.trim());
    const lng = parseFloat(parts[1]?.trim());

    if (isNaN(lat) || isNaN(lng)) return null;
    if (lat < -90 || lat > 90) return null;
    if (lng < -180 || lng > 180) return null;

    return {lat, lng};
  }, []);

  const eldLocation = locationStatus?.eld_location;
  const lodifyLocation = locationStatus?.lodify_location;

  const eldCoords = useMemo(() => {
    const coords = parseCoordinates(eldLocation);

    return coords;
  }, [eldLocation, parseCoordinates]);

  const lodifyCoords = useMemo(() => {
    const coords = parseCoordinates(lodifyLocation);

    return coords;
  }, [lodifyLocation, parseCoordinates]);

  const locationMapConfig = useMemo(() => {
    if (!eldCoords || !lodifyCoords) return null;

    const avgLat = (eldCoords.lat + lodifyCoords.lat) / 2;
    const avgLng = (eldCoords.lng + lodifyCoords.lng) / 2;

    const latDiff = Math.abs(eldCoords.lat - lodifyCoords.lat);
    const lngDiff = Math.abs(eldCoords.lng - lodifyCoords.lng);
    const maxDiff = Math.max(latDiff, lngDiff);

    let calculatedZoom = 4;
    if (maxDiff > 50) {
      calculatedZoom = 2;
    } else if (maxDiff > 20) {
      calculatedZoom = 3;
    } else if (maxDiff > 10) {
      calculatedZoom = 4;
    } else if (maxDiff > 5) {
      calculatedZoom = 5;
    } else if (maxDiff > 2) {
      calculatedZoom = 6;
    } else if (maxDiff > 1) {
      calculatedZoom = 7;
    } else if (maxDiff > 0.5) {
      calculatedZoom = 8;
    } else {
      calculatedZoom = 9;
    }

    return {
      center: {lat: avgLat, lng: avgLng},
      zoom: calculatedZoom,
    };
  }, [eldCoords, lodifyCoords]);

  const handleLocationMapApiLoaded = useCallback(
    ({map, maps}) => {
      if (!eldCoords || !lodifyCoords) return;

      if (map.locationMarkers) {
        map.locationMarkers.forEach((marker) => marker.setMap(null));
      }
      map.locationMarkers = [];

      const eldMarker = new maps.Marker({
        position: {lat: eldCoords.lat, lng: eldCoords.lng},
        map: map,
        title: "ELD Location",
        icon: {
          url: "/img/TruckMarker.svg",
          scaledSize: new maps.Size(40, 40),
          anchor: new maps.Point(20, 40),
        },
      });

      eldMarker.addListener("click", () => {
        setSelectedLocation({
          type: "eld",
          data: eldLocation,
          coordinates: eldCoords,
        });
      });
      map.locationMarkers.push(eldMarker);

      const lodifyMarker = new maps.Marker({
        position: {lat: lodifyCoords.lat, lng: lodifyCoords.lng},
        map: map,
        title: "Lodify Location",
        icon: {
          url: "/img/TruckMarker.svg",
          scaledSize: new maps.Size(40, 40),
          anchor: new maps.Point(20, 40),
        },
      });

      lodifyMarker.addListener("click", () => {
        setSelectedLocation({
          type: "lodify",
          data: lodifyLocation,
          coordinates: lodifyCoords,
        });
      });
      map.locationMarkers.push(lodifyMarker);

      const bounds = new maps.LatLngBounds();
      bounds.extend(new maps.LatLng(eldCoords.lat, eldCoords.lng));
      bounds.extend(new maps.LatLng(lodifyCoords.lat, lodifyCoords.lng));
      map.fitBounds(bounds, 50);
    },
    [eldCoords, lodifyCoords, eldLocation, lodifyLocation]
  );

  const {data: mapData = {}, isLoading} = useQuery({
    queryKey: ["TRIP_BY_MAP", id],
    queryFn: () =>
      tripsService.createTrip({
        data: {
          app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
          environment_id: envId,
          method: "location",
          object_data: {
            trip_id: id,
          },
          table: "trip",
        },
      }),
    select: (data) => data?.data || {},
  });

  const mapCenter = useMemo(() => {
    if (latitude && longitude) {
      return {lat: latitude, lng: longitude};
    }

    if (mapData?.geometry?.coordinates?.length > 0) {
      const allCoords = mapData.geometry.coordinates.flat();
      const totalLat = allCoords.reduce((sum, coord) => sum + coord[1], 0);
      const totalLng = allCoords.reduce((sum, coord) => sum + coord[0], 0);

      return {
        lat: totalLat / allCoords.length,
        lng: totalLng / allCoords.length,
      };
    }

    return {lat: 40.7128, lng: -74.006};
  }, [latitude, longitude, mapData]);

  const getMarkerType = ({lineIndex, maps, stops, stopIndex}) => {
    const stopLength = stops.length;

    const svgString = ReactDOMServer.renderToStaticMarkup(
      <StopPoint index={stopIndex} />
    );
    const svgUrl =
      "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString);

    const markerTypes = {
      start: {
        title: `START - Line ${lineIndex + 1}`,
        icon: {
          url: startIcon,
          scaledSize: new maps.Size(32, 32),
          anchor: new maps.Point(16, 16),
        },
      },
      stop: {
        title: `STOP - Line ${lineIndex + 1}`,
        icon: {
          url: svgUrl,
          scaledSize: new maps.Size(24, 24),
          anchor: new maps.Point(16, 16),
        },
      },
      finish: {
        title: `FINISH - Line ${lineIndex + 1}`,
        icon: {
          url: endIcon,
          scaledSize: new maps.Size(32, 32),
          anchor: new maps.Point(16, 16),
        },
      },
    };

    if (stopIndex === 0) return markerTypes.start;
    if (stopIndex === stopLength - 1) return markerTypes.finish;
    return markerTypes.stop;
  };

  const handleApiLoaded = ({map, maps}) => {
    if (!mapData?.geometry?.coordinates?.length) return;

    if (map.markers) {
      map.markers.forEach((marker) => marker.setMap(null));
    }
    map.markers = [];

    const existingPolylines = map
      .getDiv()
      .querySelectorAll(".coordinate-polyline");
    existingPolylines.forEach((polyline) => polyline.remove());

    const coordinates = mapData.geometry.coordinates;
    const stops = mapData.stops;
    const allCoords = [];

    coordinates.forEach((line, lineIndex) => {
      if (!line || line.length === 0) return;

      const path = line.map(([lng, lat]) => {
        allCoords.push([lng, lat]);
        return {lat, lng};
      });

      const polyline = new maps.Polyline({
        path,
        geodesic: true,
        strokeColor: lineColor,
        strokeOpacity: 0.8,
        strokeWeight: 3,
        className: "coordinate-polyline",
      });
      polyline.setMap(map);

      if (showMarkers) {
        stops.forEach((stop, stopIndex) => {
          const latLong = stop?.location?.split(",");

          const lat = Number(latLong[1]);
          const lng = Number(latLong[0]);

          const marketType = getMarkerType({lineIndex, maps, stopIndex, stops});

          const newMarker = new maps.Marker({
            position: {lat, lng},
            map: map,
            title: marketType.title,
            icon: {...marketType.icon},
          });

          map.markers.push(newMarker);
        });

        if (showAllStops && line.length > 2) {
          line.forEach((coord, index) => {
            if (index === 0 || index === line.length - 1) return;

            const stopMarker = new maps.Marker({
              position: {lat: coord[1], lng: coord[0]},
              map: map,
              title: `STOP ${index} - Line ${lineIndex + 1}`,
              icon: {
                url: stopIcon,
                scaledSize: new maps.Size(24, 24),
                anchor: new maps.Point(12, 12),
              },
            });
            map.markers.push(stopMarker);
          });
        }
      }
    });

    if (allCoords.length > 0) {
      const bounds = new maps.LatLngBounds();
      allCoords.forEach((coord) => {
        bounds.extend(new maps.LatLng(coord[1], coord[0]));
      });
      map.fitBounds(bounds);
    }
  };

  if (isLoading) {
    return (
      <Box
        w="100%"
        h="100%"
        display="flex"
        justifyContent="center"
        alignItems="center">
        <Spinner size="lg" color="blue.500" />
      </Box>
    );
  }

  if (eldCoords && lodifyCoords && locationMapConfig) {
    return (
      <Box position="relative" w="100%" h="100%">
        <GoogleMapReact
          bootstrapURLKeys={{key: "AIzaSyAdBRYyeH13KXV-VtXpQuG36A7vbBjibMU"}}
          defaultCenter={locationMapConfig.center}
          center={locationMapConfig.center}
          defaultZoom={locationMapConfig.zoom}
          zoom={locationMapConfig.zoom}
          onGoogleApiLoaded={handleLocationMapApiLoaded}
          yesIWantToUseGoogleMapApiInternals
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            mapTypeId: "roadmap",
          }}
        />
        <LocationInfoPopup
          isOpen={selectedLocation !== null}
          onClose={() => setSelectedLocation(null)}
          locationType={selectedLocation?.type}
          locationData={selectedLocation?.data}
          coordinates={selectedLocation?.coordinates}
        />
      </Box>
    );
  }

  return (
    <GoogleMapReact
      bootstrapURLKeys={{key: "AIzaSyAdBRYyeH13KXV-VtXpQuG36A7vbBjibMU"}}
      center={mapCenter}
      defaultZoom={13}
      options={{
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
        mapTypeId: "roadmap",
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{visibility: "off"}],
          },
        ],
      }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={handleApiLoaded}
    />
  );
}

export default GoogleLiveComponent;
