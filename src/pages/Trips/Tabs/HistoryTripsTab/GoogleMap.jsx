import React from "react";
import GoogleMapReact from "google-map-react";
import { coordinates } from "../../components/mapCoordinates";

function GoogleMap() {
  const handleApiLoaded = ({ map, maps }) => {
    coordinates.forEach((route) => {
      const path = route.map(([lng, lat]) => ({ lat, lng }));

      const polyline = new maps.Polyline({
        path,
        geodesic: true,
        strokeColor: "blue",
        strokeOpacity: 1.0,
        strokeWeight: 3,
      });

      polyline.setMap(map);
    });
  };

  return (
    <div style={{ height: "500px", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{
          key: "AIzaSyAdBRYyeH13KXV-VtXpQuG36A7vbBjibMU",
        }}
        defaultCenter={{ lat: 40.7128, lng: -74.006 }}
        defaultZoom={15}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={handleApiLoaded}
      />
    </div>
  );
}

export default GoogleMap;
