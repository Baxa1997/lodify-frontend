import React, { useMemo } from "react";
import GoogleMapReact from "google-map-react";
import tripsService from "@services/tripsService";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { Box, Spinner, Text } from "@chakra-ui/react";
import ReactDOMServer from "react-dom/server";

const StopPoint = ({ index }) => {
  return  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16">
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
      fill="#fff"
    >
      {index}
    </text>
  </svg>;
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
}) {
  const envId = useSelector((state) => state.auth.environmentId);
  const { id } = useParams();

  const { data: mapData = {}, isLoading } = useQuery({
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
      return { lat: latitude, lng: longitude };
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

    return { lat: 40.7128, lng: -74.006 };
  }, [latitude, longitude, mapData]);

  const getMarkerType = ({ lineIndex, maps, stops, stopIndex }) => {
    const stopLength = stops.length;

    const svgString = ReactDOMServer.renderToStaticMarkup(<StopPoint index={stopIndex} />);
    const svgUrl = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svgString);

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

    if(stopIndex === 0) return markerTypes.start;
    if(stopIndex === stopLength - 1) return markerTypes.finish;
    return markerTypes.stop;
  };

  const handleApiLoaded = ({ map, maps }) => {
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
        return { lat, lng };
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

          console.log({ lat,
            lng, stop });


          const marketType = getMarkerType({ lineIndex, maps, stopIndex, stops });

          const newMarker = new maps.Marker({
            position: { lat, lng },
            map: map,
            title: marketType.title,
            icon: { ...marketType.icon },
          });

          map.markers.push(newMarker);
        });

        if (showAllStops && line.length > 2) {
          line.forEach((coord, index) => {
            if (index === 0 || index === line.length - 1) return;

            const stopMarker = new maps.Marker({
              position: { lat: coord[1], lng: coord[0] },
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
        <Spinner
          size="lg"
          color="blue.500" />
      </Box>
    );
  }

  if (!mapData?.geometry?.coordinates?.length) {
    return (
      <Box
        w="100%"
        h="100%"
        display="flex"
        justifyContent="center"
        alignItems="center">
        <Text>No route data available</Text>
      </Box>
    );
  }

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: "AIzaSyAdBRYyeH13KXV-VtXpQuG36A7vbBjibMU" }}
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
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
      yesIWantToUseGoogleMapApiInternals
      onGoogleApiLoaded={handleApiLoaded}
    />
  );
}

export default GoogleLiveComponent;
