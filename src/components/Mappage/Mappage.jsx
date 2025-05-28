import React, { useEffect, useState, useRef } from "react";
import HeroImg from "../../assets/17.jpg";
import RestaurantLogo from "../../assets/Youtube.png";
import TouristSpotLogo from "../../assets/Youtube.png";
import SecondLogo from "../../assets/Instagram.png";
import { motion } from "framer-motion";
import { FaHome } from "react-icons/fa";
import axios from "axios";

const goToHome = () => {
  window.location.href = "/";
};

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [trafficLayer, setTrafficLayer] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [nearbyList, setNearbyList] = useState({
    restaurants: [],
    busStops: [],
    touristSpots: [],
  });
  const [userLocation, setUserLocation] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchedLocation, setSearchedLocation] = useState("");

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (!window.google) {
        const script = document.createElement("script");
        script.src =
          "https://maps.googleapis.com/maps/api/js?key=&libraries=places"; //replace Google Map API Key
        script.async = true;
        script.defer = true;
        script.onload = initializeMap;
        document.body.appendChild(script);
      } else {
        initializeMap();
      }
    };

    const initializeMap = () => {
      if (!window.google || !mapRef.current) return;

      const newMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: 9.52867074418299, lng: 76.82343630525207 },
        zoom: 13,
        styles: [
          {
            featureType: "all",
            elementType: "all",
            stylers: [
              { saturation: 20 },
              { lightness: 10 },
              { visibility: "on" },
            ],
          },
        ],
      });

      setMap(newMap);

      const newTrafficLayer = new window.google.maps.TrafficLayer();
      newTrafficLayer.setMap(newMap);
      setTrafficLayer(newTrafficLayer);

      const service = new window.google.maps.DirectionsService();
      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(newMap);

      setDirectionsService(service);
      setDirectionsRenderer(renderer);
    };

    loadGoogleMapsScript();
  }, []);

  const addMarker = (location, color, title) => {
    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
      icon: `http://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
      title: title,
    });
    setMarkers((prevMarkers) => [...prevMarkers, marker]);
    return marker;
  };

  const performSearch = (event) => {
    event.preventDefault();
    const searchInput = document.getElementById("search-input").value;
    setSearchedLocation(searchInput);
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address: searchInput }, (results, status) => {
      if (
        status === window.google.maps.GeocoderStatus.OK &&
        results.length > 0
      ) {
        const location = results[0].geometry.location;
        map.setCenter(location);
        new window.google.maps.Marker({
          position: location,
          map: map,
        });
        getNearbyPlaces(location, map);
        setHasSearched(true);
      } else {
        console.log("No results found for the search query.");
      }
    });
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = new window.google.maps.LatLng(latitude, longitude);
          setUserLocation(location);
          map.setCenter(location);
          new window.google.maps.Marker({
            position: location,
            map: map,
          });
          getNearbyPlaces(location, map);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const getNearbyPlaces = async (location, currentMap) => {
    if (!window.google || !currentMap) return;

    const service = new window.google.maps.places.PlacesService(currentMap);
    const categories = {
      restaurants: "restaurant",
      busStops: "bus_station",
      touristSpots: "tourist_attraction",
    };

    const results = {
      restaurants: [],
      busStops: [],
      touristSpots: [], // This will include both Google Places and user spots
    };

    // Clear existing markers
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);

    // First fetch Google Places results
    for (const [category, type] of Object.entries(categories)) {
      try {
        const response = await new Promise((resolve) => {
          service.nearbySearch(
            { location: location, radius: 10000, type: type },
            (places, status) => {
              if (
                status === window.google.maps.places.PlacesServiceStatus.OK &&
                places
              ) {
                resolve(places.slice(0, 5));
              } else {
                resolve([]);
              }
            }
          );
        });

        response.forEach((place) => {
          const marker = addMarker(
            place.geometry.location,
            category === "restaurants"
              ? "green"
              : category === "busStops"
              ? "blue"
              : "red",
            place.name
          );

          marker.addListener("click", () => {
            const infoWindow = new window.google.maps.InfoWindow({
              content: `<div style="color: black;">
                          <h3>${place.name}</h3>
                          <p>${place.vicinity}</p>
                          ${
                            place.rating
                              ? `<p>Rating: ${place.rating} ⭐</p>`
                              : ""
                          }
                        </div>`,
            });
            infoWindow.open(currentMap, marker);
          });
        });

        results[category] = response.map((place) => ({
          name: place.name,
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          rating: place.rating,
          address: place.vicinity,
          isGooglePlace: true,
        }));
      } catch (error) {
        console.error(`Error fetching ${category}:`, error);
      }
    }

    // Then fetch user-submitted spots from your database
    try {
      const userSpotsResponse = await axios.get(
        "http://localhost:5000/api/user-spots",
        {
          params: {
            latitude: location.lat(),
            longitude: location.lng(),
            radius: 10, // 10km radius
          },
        }
      );

      // Add purple markers for user spots
      userSpotsResponse.data.data.forEach((spot) => {
        const marker = addMarker(
          new window.google.maps.LatLng(
            spot.location.coordinates[1],
            spot.location.coordinates[0]
          ),
          "purple",
          spot.name
        );

        marker.addListener("click", () => {
          const infoWindow = new window.google.maps.InfoWindow({
            content: `<div style="color: black;">
                        <h3 style="color: purple;">${spot.name}</h3>
                        <p>Transport: ${spot.preferredTransport}</p>
                        <p>Best Time: ${spot.preferredTime}</p>
                      </div>`,
          });
          infoWindow.open(currentMap, marker);
        });
      });

      // Add user spots to touristSpots results
      const userSpots = userSpotsResponse.data.data.map((spot) => ({
        name: spot.name,
        lat: spot.location.coordinates[1],
        lng: spot.location.coordinates[0],
        address: spot.additionalNotes || "User submitted location",
        preferredTransport: spot.preferredTransport,
        preferredTime: spot.preferredTime,
        isUserSpot: true,
      }));

      // Combine Google Places and user spots
      results.touristSpots = [...results.touristSpots, ...userSpots];
    } catch (error) {
      console.error("Error fetching user spots:", error);
    }

    setNearbyList(results);
  };

  const getDirections = (destination) => {
    if (!userLocation || !directionsService || !directionsRenderer) return;

    const request = {
      origin: userLocation,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsService.route(request, (result, status) => {
      if (status === window.google.maps.DirectionsStatus.OK) {
        setCurrentRoute(result);
        directionsRenderer.setDirections(result);
      } else {
        console.log("Error occurred while retrieving directions:", status);
      }
    });
  };

  const getInstaFoodUrl = (location) => {
    const formattedLocation = location.replace(/\s+/g, "");
    return `https://www.instagram.com/explore/search/keyword/?q=%23${formattedLocation}food`;
  };

  const getYtFoodUrl = (location) => {
    const formattedLocation = location.replace(/\s+/g, "");
    return `https://www.youtube.com/results?search_query=${formattedLocation}+food`;
  };

  const getInstaSpotUrl = (location) => {
    const formattedLocation = location.replace(/\s+/g, "");
    return `https://www.instagram.com/explore/search/keyword/?q=%23${formattedLocation}Tourism`;
  };

  const getYtSpotUrl = (location) => {
    const formattedLocation = location.replace(/\s+/g, "");
    return `https://www.youtube.com/results?search_query=${formattedLocation}+Tourism`;
  };

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60 backdrop-blur-sm"></div>

      <div className="relative z-10 min-h-screen px-6 py-7 flex flex-col gap-5 md:px-10 lg:px-20 lg:py-7">
        <header id="legend" className="flex justify-between items-center">
          <h1 className="font-extrabold text-4xl text-white drop-shadow-md">
            SPOTON
          </h1>
        </header>

        <form
          id="search-form"
          onSubmit={performSearch}
          className="flex flex-col max-w-[400px] gap-4 py-9"
        >
          <div className="relative">
            <input
              type="text"
              id="search-input"
              placeholder="Search location..."
              className="w-full px-4 py-2 bg-transparent border border-white rounded text-white focus:ring-2 focus:ring-white"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-2 rounded-md hover:bg-black hover:text-white transition-colors duration-200"
          >
            Search
          </button>

          <button
            type="button"
            onClick={getCurrentLocation}
            className="bg-white text-black font-semibold py-2 px-4 rounded-md hover:bg-black hover:text-white transition-colors duration-200"
          >
            Location
          </button>
        </form>

        <div className="text-white">
          <h2 className="text-2xl font-bold mb-4">Nearby Places</h2>
          <div>
            <h3 className="text-xl font-semibold flex items-center">
              Restaurants
              {hasSearched && (
                <>
                  <a
                    href={getYtFoodUrl(searchedLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={RestaurantLogo}
                      alt="Restaurant Logo"
                      className="w-6 h-6 ml-2 cursor-pointer"
                    />
                  </a>
                  <a
                    href={getInstaFoodUrl(searchedLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={SecondLogo}
                      alt="Second Logo"
                      className="w-6 h-6 ml-2 cursor-pointer"
                    />
                  </a>
                </>
              )}
            </h3>
            <ul>
              {nearbyList.restaurants.map((place, index) => (
                <li
                  key={index}
                  onClick={() =>
                    getDirections(
                      new window.google.maps.LatLng(place.lat, place.lng)
                    )
                  }
                  className="cursor-pointer hover:underline"
                >
                  {place.name} (Rating: {place.rating || "N/A"})
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold flex items-center">
              Bus Stops
            </h3>
            <ul>
              {nearbyList.busStops.map((place, index) => (
                <li
                  key={index}
                  onClick={() =>
                    getDirections(
                      new window.google.maps.LatLng(place.lat, place.lng)
                    )
                  }
                  className="cursor-pointer hover:underline"
                >
                  {place.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold flex items-center">
              Tourist Spots
              {hasSearched && (
                <>
                  <a
                    href={getYtSpotUrl(searchedLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={TouristSpotLogo}
                      alt="Tourist Spot Logo"
                      className="w-6 h-6 ml-2 cursor-pointer"
                    />
                  </a>
                  <a
                    href={getInstaSpotUrl(searchedLocation)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={SecondLogo}
                      alt="Second Logo"
                      className="w-6 h-6 ml-2 cursor-pointer"
                    />
                  </a>
                </>
              )}
            </h3>
            <ul>
              {nearbyList.touristSpots.map((place, index) => (
                <li
                  key={index}
                  onClick={() =>
                    getDirections(
                      new window.google.maps.LatLng(place.lat, place.lng)
                    )
                  }
                  className={`cursor-pointer hover:underline ${
                    place.isUserSpot ? "text-purple-300" : ""
                  }`}
                >
                  {place.name}
                  {place.rating && ` (Rating: ${place.rating} ⭐)`}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="hidden lg:block fixed top-10 right-0 h-screen w-[40%] lg:w-[50%] px-5 py-10">
          <div className="relative outline outline-green-600 outline-4 shadow-2xl drop-shadow-2xl shadow-green-700 lg:h-[600px] lg:w-[600px] w-[300px] h-[300px] max-sm:rounded-md lg:rounded-full overflow-hidden">
            <div
              ref={mapRef}
              id="map"
              style={{ height: "100%", width: "100%" }}
            ></div>
          </div>
        </div>
        <motion.button
          onClick={goToHome}
          className="fixed bottom-8 right-8 z-50 p-3 bg-blue-400/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-blue-400/30 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Go to home"
        >
          <FaHome />
        </motion.button>
      </div>
    </div>
  );
};

export default GoogleMapComponent;
