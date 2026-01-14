import React, {useMemo, useCallback, useState} from "react";
import GoogleMapReact from "google-map-react";
import tripsService from "@services/tripsService";
import {useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {useQuery} from "@tanstack/react-query";
import {Box, Spinner, Text, Flex} from "@chakra-ui/react";
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

function GoogleLiveComponent({
  tripData = {},
  latitude,
  longitude,
  showMarkers = true,
  showAllStops = false,
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
    queryKey: ["TRIP_BY_MAP", id, tripData],
    queryFn: () =>
      tripsService.createTrip({
        data: {
          app_id: "P-oyMjPNZutmtcfQSnv1Lf3K55J80CkqyP",
          environment_id: envId,
          method: "location",
          object_data: {
            trip_id: id,
            trip_pickups: tripData?.pickups,
          },
          table: "trip",
        },
      }),
    enabled: !!tripData?.pickups?.length,
    select: (data) => data?.data || {},
  });

  const mapCenter = useMemo(() => {
    if (latitude && longitude) {
      return {lat: latitude, lng: longitude};
    }

    if (mapData?.response?.[0]?.length > 0) {
      const allCoords = mapData?.response?.flat();
      const totalLat = allCoords.reduce((sum, coord) => sum + coord[1], 0);
      const totalLng = allCoords.reduce((sum, coord) => sum + coord[0], 0);

      return {
        lat: totalLat / allCoords.length,
        lng: totalLng / allCoords.length,
      };
    }

    return {lat: 40.7128, lng: -74.006};
  }, [latitude, longitude, mapData]);

  const handleApiLoaded = ({map, maps}) => {
    if (!mapData?.response?.length) return;

    if (map.markers) {
      map.markers.forEach((marker) => marker.setMap(null));
    }
    map.markers = [];

    if (map.polylines) {
      map.polylines.forEach((polyline) => polyline.setMap(null));
    }
    map.polylines = [];

    const coordinates = mapData.response;
    const stops = tripData?.pickups || [];
    const allCoords = [];

    coordinates.forEach((line, lineIndex) => {
      if (!line || line.length === 0) return;

      const path = line.map(([lng, lat]) => {
        allCoords.push([lng, lat]);
        return {lat, lng};
      });

      const segmentColor = "#007BFF";
      const polyline = new maps.Polyline({
        path,
        geodesic: true,
        strokeColor: segmentColor,
        strokeOpacity: 0.8,
        strokeWeight: 4,
      });
      polyline.setMap(map);
      map.polylines.push(polyline);

      if (showMarkers && line.length > 0) {
        const startCoord = line[0];
        const startMarker = new maps.Marker({
          position: {lat: startCoord[1], lng: startCoord[0]},
          map: map,
          title: `Start - Segment ${lineIndex + 1}`,
          label: {
            text: `${lineIndex + 1}`,
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
          },
          icon: {
            url: startIcon,
            scaledSize: new maps.Size(36, 36),
            anchor: new maps.Point(18, 18),
          },
        });
        map.markers.push(startMarker);

        const endCoord = line[line.length - 1];
        const endMarker = new maps.Marker({
          position: {lat: endCoord[1], lng: endCoord[0]},
          map: map,
          title: `End - Segment ${lineIndex + 1}`,
          label: {
            text: `${lineIndex + 1}`,
            color: "white",
            fontSize: "14px",
            fontWeight: "bold",
          },
          icon: {
            url: endIcon,
            scaledSize: new maps.Size(36, 36),
            anchor: new maps.Point(18, 18),
          },
        });
        map.markers.push(endMarker);

        if (showAllStops && line.length > 2) {
          line.forEach((coord, coordIndex) => {
            if (coordIndex === 0 || coordIndex === line.length - 1) return;

            const svgString = ReactDOMServer.renderToStaticMarkup(
              <StopPoint index={coordIndex} />
            );
            const svgUrl =
              "data:image/svg+xml;charset=UTF-8," +
              encodeURIComponent(svgString);

            const stopMarker = new maps.Marker({
              position: {lat: coord[1], lng: coord[0]},
              map: map,
              title: `Stop ${coordIndex} - Segment ${lineIndex + 1}`,
              icon: {
                url: svgUrl,
                scaledSize: new maps.Size(24, 24),
                anchor: new maps.Point(12, 12),
              },
            });
            map.markers.push(stopMarker);
          });
        }
      }

      if (showMarkers && stops[lineIndex]) {
        const stop = stops[lineIndex];
        const latLong = stop?.location?.split(",");

        if (latLong && latLong.length === 2) {
          const lat = Number(latLong[1]);
          const lng = Number(latLong[0]);

          if (!isNaN(lat) && !isNaN(lng)) {
            const addressMarker = new maps.Marker({
              position: {lat, lng},
              map: map,
              title: stop?.address || `Address ${lineIndex + 1}`,
              icon: {
                url: stopIcon,
                scaledSize: new maps.Size(32, 32),
                anchor: new maps.Point(16, 16),
              },
            });
            map.markers.push(addressMarker);
          }
        }
      }
    });

    if (allCoords.length > 0) {
      const bounds = new maps.LatLngBounds();
      allCoords.forEach((coord) => {
        bounds.extend(new maps.LatLng(coord[1], coord[0]));
      });
      map.fitBounds(bounds);

      const padding = 50;
      map.fitBounds(bounds, padding);
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
        <Spinner size="lg" color="#ff5b04" />
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
