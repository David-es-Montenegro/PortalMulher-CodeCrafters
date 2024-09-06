import React, { useState, useEffect } from "react";
import { GoogleMap, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";

const libraries = ["places"];
const mapContainerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: -3.745,
  lng: -38.523,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBMl7bq8pTI4GTAdSravW10cJGMi_fJEyA", // Substitua pela sua chave de API
    libraries,
  });

  const [userLocation, setUserLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [destination, setDestination] = useState(null); // Armazena o destino selecionado
  const [travelMode, setTravelMode] = useState("DRIVING");
  const [searchTerm, setSearchTerm] = useState("Delegacia da Mulher"); // Termo padrão

  // Capturar a localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => null
      );
    }
  }, []);

  // Função para buscar o local mais próximo com base no termo de pesquisa
  const searchNearby = () => {
    if (!userLocation) return;

    const service = new window.google.maps.places.PlacesService(
      document.createElement('div')
    );

    // Fazer a busca com base no termo de pesquisa e localização atual
    service.nearbySearch(
      {
        location: userLocation,
        radius: 5000, // Defina o raio em metros (5km neste caso)
        keyword: searchTerm, // Termo de pesquisa, ex: "Delegacia da Mulher"
      },
      (results, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results.length > 0) {
          const closestPlace = results[0];
          setDestination(closestPlace.geometry.location); // Armazena o destino
          calculateRoute(closestPlace.geometry.location);
        } else {
          console.error("Nenhum local encontrado");
        }
      }
    );
  };

  // Função para calcular a rota até o local encontrado
  const calculateRoute = async (destination) => {
    if (!destination || !userLocation) return;

    const directionsService = new window.google.maps.DirectionsService();

    const result = await directionsService.route({
      origin: userLocation,
      destination: destination,
      travelMode: travelMode,
    });

    setDirectionsResponse(result);
  };

  // Função para abrir o Google Maps com as direções
  const openGoogleMapsDirections = () => {
    if (!userLocation || !destination) return;

    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat()},${destination.lng()}&travelmode=${travelMode.toLowerCase()}`;
    window.open(url, '_blank');
  };

  if (loadError) return "Erro ao carregar o mapa";
  if (!isLoaded) return "Carregando mapa...";

  return (
    <div>
      <div>
        {/* Dropdown para selecionar o termo de pesquisa */}
        <select value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}>
          <option value="Delegacia da Mulher">Delegacia da Mulher</option>
          <option value="Hospital mulher publico">Hospital da mulher</option>
          <option value="Apoio psicologico mulher publico">Apoio psicologico</option>
        </select>

        {/* Dropdown para selecionar o meio de transporte */}
        <select onChange={(e) => setTravelMode(e.target.value)}>
          <option value="DRIVING">Carro</option>
          <option value="WALKING">A pé</option>
          <option value="BICYCLING">Bicicleta</option>
          <option value="TRANSIT">Transporte Público</option>
        </select>

        {/* Botão para iniciar a busca */}
        <button onClick={searchNearby}>Buscar e Calcular Rota</button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={14}
        center={userLocation || center}
        options={options}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
      </GoogleMap>

      {destination && (
        <button onClick={openGoogleMapsDirections}>Abrir no Google Maps</button>
      )}
    </div>
  );
}

export default App;
