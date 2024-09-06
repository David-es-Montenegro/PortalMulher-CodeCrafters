import React, { useState, useEffect } from "react";
import style from "./mapa.module.css";
import HamburgerMenu from "../../components/Hamburger/Hamburger";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

const Mapa = () => {
  const center = {
    lat: -8.03276454056884,
    lng: -34.971299589301054,
  };

  const [location, setLocation] = useState(center);

  const success = (pos) => {
    const coord = pos.coords;

    setLocation({
      lat: coord.latitude,
      lng: coord.longitude,
    });
  };

  const errors = (err) => console.warn(`ERROR(${err.code}): ${err.message}`);

  const options = { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, errors, options);
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className={style.mapContainer}>
      <header className={style.headerContainer}>
        <HamburgerMenu />
        <h1 className={style.headerH1}>Mapa de Serviços</h1>
      </header>

      <div className={style.iframeMap}>
        <APIProvider apiKey={API_KEY}>
          <Map
            style={{ width: "100vw", height: "600px" }}
            defaultCenter={location}
            defaultZoom={10}
            gestureHandling={"greedy"}
            disableDefaultUI={true}
          ></Map>
        </APIProvider>
      </div>
    </div>
  );
};

export default Mapa;
