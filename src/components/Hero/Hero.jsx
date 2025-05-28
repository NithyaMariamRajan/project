import React, { useState, useEffect } from "react";
import { FaPlay, FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import styled from "styled-components";

const WeatherCard = ({ weatherData }) => {
  if (!weatherData) return null;

  const { location, current } = weatherData;
  const date = new Date(location.localtime);

  return (
    <div className="weather-card">
      <section className="info-section">
        <div className="background-design">
          <div className="circle" />
          <div className="circle" />
          <div className="circle" />
        </div>
        <div className="left-side">
          <div className="weather">
            <div>
              <img
                src={`https:${current.condition.icon}`}
                alt={current.condition.text}
              />
            </div>
            <div>{current.condition.text}</div>
          </div>
          <div className="temperature">{current.temp_c}°</div>
          <div className="range">
            {current.feelslike_c}°/{current.humidity}%
          </div>
        </div>
        <div className="right-side">
          <div>
            <div className="hour">
              {date.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            <div className="date">
              {date.toLocaleDateString([], {
                weekday: "short",
                month: "2-digit",
                day: "2-digit",
              })}
            </div>
          </div>
          <div className="city">{location.name}</div>
        </div>
      </section>
    </div>
  );
};

// Styled Components for Weather Card
const WeatherCardStyles = styled.div`
  .weather-card {
    display: flex;
    flex-direction: column;
    height: 140px;
    width: 260px;
    border-radius: 20px;
    overflow: hidden;

    /* Frosted glass effect */
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    color: white;
  }

  .info-section {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    height: 100%;
  }

  .background-design {
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(
      135deg,
      rgba(236, 114, 99, 0.3) 0%,
      rgba(239, 199, 69, 0.2) 100%
    );
    overflow: hidden;
  }

  .circle {
    background-color: rgba(239, 199, 69, 0.3);
    backdrop-filter: blur(2px);
  }

  /* Circle positions */
  .circle:nth-child(1) {
    position: absolute;
    top: -80%;
    right: -50%;
    width: 200px;
    height: 200px;
    opacity: 0.4;
    border-radius: 50%;
  }
  .circle:nth-child(2) {
    position: absolute;
    top: -70%;
    right: -30%;
    width: 150px;
    height: 150px;
    opacity: 0.4;
    border-radius: 50%;
  }
  .circle:nth-child(3) {
    position: absolute;
    top: -35%;
    right: -8%;
    width: 80px;
    height: 80px;
    opacity: 1;
    border-radius: 50%;
  }

  /* Left side styles */
  .left-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    z-index: 1;
    padding-left: 18px;
  }

  .weather {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
  }

  .weather img {
    width: 30px;
    height: 30px;
  }

  .temperature {
    font-size: 28px;
    font-weight: 500;
  }

  .range {
    font-size: 12px;
    opacity: 0.8;
  }

  /* Right side styles */
  .right-side {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 100%;
    padding-right: 18px;
    z-index: 1;
    text-align: right;
  }

  .hour {
    font-size: 18px;
    font-weight: 500;
  }

  .date {
    font-size: 12px;
    opacity: 0.8;
  }

  .city {
    font-size: 14px;
    font-weight: 500;
  }
`;

const Hero = () => {
  const [isClicked, setIsClicked] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const response = await fetch(
          `https://api.weatherapi.com/v1/current.json?key=&q=${lat},${lon}` //replace with your API key
        );
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        setError("Failed to load weather data");
      } finally {
        setLoading(false);
      }
    };

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude);
        },
        (err) => {
          setError("Location access denied");
          // Fallback to default location (e.g., Kochi)
          fetchWeather(9.9312, 76.2673);
        }
      );
    } else {
      setError("Geolocation not supported");
      fetchWeather(9.9312, 76.2673); // Fallback
    }
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <section className="min-h-[900px] flex justify-center items-center bg-cover bg-gradient-to-t from-brandDark from-2% to-transparent to-15% h-full">
        {/* Background elements */}
        <div
          className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black z-10"
          style={{
            background:
              "radial-gradient(circle, rgba(0, 0, 0, 0.3) 50%, rgba(11, 11, 13, 0.5) 70%, rgba(11, 11, 13, 0.8) 90%)",
          }}
        ></div>

        {/* Weather Card - Positioned at top right */}
        {!loading && weatherData && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <div className="absolute center right-8 z-30">
              <WeatherCardStyles>
                <WeatherCard weatherData={weatherData} />
              </WeatherCardStyles>
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="container relative z-20 text-center space-y-8"
        >
          <h1 className="text-5xl md:text-8xl font-bold font-greatVibes mt-[-250px]">
            Spot On
          </h1>
          <p className="uppercase font-semibold">
            Discover local gems and routes while on the move....
          </p>
          <div className="relative inline-block"></div>
          <motion.div
            onClick={() => setIsClicked(!isClicked)}
            className="inline-flex justify-center items-center border-2 h-14 w-14 rounded-full !mt-14 md:!mt-20 cursor-pointer"
            animate={{ rotate: isClicked ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FaPlay />
          </motion.div>

          {isClicked && (
            <motion.div
              className="flex space-x-4 mt-4 justify-center "
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <button className="px-6 py-2 text-sm uppercase font-semibold text-white rounded-md backdrop-blur-sm bg-green-400/20 border border-white/30">
                <a href="/mappage">Explore</a>
              </button>
              <button className="px-6 py-2 text-sm uppercase font-semibold text-white rounded-md backdrop-blur-sm bg-green-400/20 border border-white/30">
                <a href="/travelplanner">Create Schedule</a>
              </button>
            </motion.div>
          )}
        </motion.div>

        <motion.button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 p-3 bg-green-400/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-green-400/30 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Go to top"
        >
          <FaArrowUp />
        </motion.button>
      </section>
    </>
  );
};

export default Hero;
