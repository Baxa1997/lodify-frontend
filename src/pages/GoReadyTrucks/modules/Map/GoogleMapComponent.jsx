import React, {useCallback, useRef, useState} from "react";
import GoogleMapReact from "google-map-react";
import styles from "../../style.module.scss";
import {Box} from "@chakra-ui/react";

const LocationMarker = ({lat, lng, onClick}) => (
  <div className={styles.marker} onClick={onClick}>
    <div className={styles.markerInner}>
      <div className={styles.markerDot}></div>
    </div>
  </div>
);

const GoogleMapComponent = () => {
  const [latitude, setLatitude] = useState(36.7783);
  const [longitude, setLongitude] = useState(119.4179);
  const mapRef = useRef(null);

  const onMapLoad = useCallback((map) => {
    if (mapRef.current) {
      return;
    }
  }, []);

  return (
    <Box
      mt="20px"
      width="100%"
      height="calc(100vh - 320px)"
      borderRadius="12px"
      border="1px solid #E2E8F0"
      overflow="hidden">
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAdBRYyeH13KXV-VtXpQuG36A7vbBjibMU",
        }}
        defaultCenter={{
          lat: latitude,
          lng: longitude,
        }}
        defaultZoom={11}
        onGoogleApiLoaded={({map}) => onMapLoad(map)}
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
    </Box>
  );
};

export default GoogleMapComponent;
