import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp } from "../../utility/animation";
import { FiX, FiMapPin, FiInfo, FiExternalLink, FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

// Sample location data with high-quality portrait images (replace with your actual imports)
const locationData = [
  // Indian Locations
  {
    id: 1,
    title: "Taj Mahal",
    place: "Agra, India",
    image:
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    lat: 27.1751,
    lng: 78.0421,
    rating: 4.8,
    reviews: 12500,
    description:
      "An ivory-white marble mausoleum on the south bank of the Yamuna river, one of the Seven Wonders of the World.",
  },
  {
    id: 2,
    title: "Backwaters",
    place: "Alleppey, India",
    image:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    lat: 9.4981,
    lng: 76.3388,
    rating: 4.6,
    reviews: 8900,
    description:
      "A network of brackish lagoons and lakes lying parallel to the Arabian Sea coast in Kerala.",
  },
  {
    id: 3,
    title: "Hawa Mahal",
    place: "Jaipur, India",
    image:
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    lat: 26.9239,
    lng: 75.8267,
    rating: 4.5,
    reviews: 7600,
    description:
      "The 'Palace of Winds' with its unique five-story exterior resembling a honeycomb.",
  },
  // International Locations
  {
    id: 4,
    title: "Eiffel Tower",
    place: "Paris, France",
    image:
      "https://images.unsplash.com/photo-1431274172761-fca41d930114?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    lat: 48.8584,
    lng: 2.2945,
    rating: 4.9,
    reviews: 15800,
    description:
      "Wrought-iron lattice tower on the Champ de Mars, one of the most recognized structures in the world.",
  },
  {
    id: 5,
    title: "Great Wall",
    place: "China",
    image:
      "https://images.unsplash.com/photo-1547981609-4b6bfe67ca0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    lat: 40.4319,
    lng: 116.5704,
    rating: 4.7,
    reviews: 14200,
    description:
      "Series of fortifications made of stone, brick, tamped earth, wood, and other materials.",
  },
  {
    id: 6,
    title: "Machu Picchu",
    place: "Peru",
    image:
      "https://images.unsplash.com/photo-1526397751294-331021109fbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    lat: -13.1631,
    lng: -72.545,
    rating: 4.9,
    reviews: 13600,
    description:
      "15th-century Inca citadel located on a mountain ridge 2,430 meters above sea level.",
  },
  // More locations can be added
];

const RatingStars = ({ rating }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  for (let i = 1; i <= 5; i++) {
    if (i <= fullStars) {
      stars.push(<FaStar key={i} className="text-yellow-400" />);
    } else if (i === fullStars + 1 && hasHalfStar) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    } else {
      stars.push(<FiStar key={i} className="text-yellow-400 opacity-30" />);
    }
  }

  return <div className="flex">{stars}</div>;
};

const Explore = () => {
  const [selectedCard, setSelectedCard] = useState(null);
  const [randomLocations, setRandomLocations] = useState([]);

  // Shuffle locations on component mount
  useEffect(() => {
    const shuffled = [...locationData].sort(() => 0.5 - Math.random());
    setRandomLocations(shuffled.slice(0, 9)); // Select 9 random locations
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-10 px-4 md:px-10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.2 }}
        className="text-center max-w-3xl mx-auto space-y-4"
      >
        <h1 className="text-4xl font-extrabold text-gray-400">SpotOn</h1>
        <p className="text-gray-300">
          Discover breathtaking locations around the world
        </p>
      </motion.div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 place-items-center w-full max-w-7xl">
        {randomLocations.map((data, index) => (
          <motion.div
            variants={SlideUp(0.1 * (index + 1))}
            initial="hidden"
            animate="visible"
            key={`${data.id}-${index}`} // Unique key with index
            className="relative w-full h-[550px] overflow-hidden rounded-lg shadow-lg cursor-pointer"
            onClick={() => setSelectedCard(data)}
          >
            <img
              src={data.image}
              alt={data.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end items-center text-white p-6">
              <h3 className="text-2xl font-semibold text-center">
                {data.title}
              </h3>
              <p className="uppercase text-sm">{data.place}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Popup Modal */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedCard(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="relative w-full max-w-6xl h-[80vh] bg-white rounded-xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${selectedCard.image})` }}
              >
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col md:flex-row">
                {/* Left Side - Map */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full p-4">
                  <div className="h-full rounded-lg overflow-hidden shadow-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100000.0!2d${
                        selectedCard.lng
                      }!3d${
                        selectedCard.lat
                      }!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s${encodeURIComponent(
                        selectedCard.place + ", " + selectedCard.title
                      )}!5e0!3m2!1sen!2sin!4v${Date.now()}!5m2!1sen!2sin&zoom=14&q=${encodeURIComponent(
                        selectedCard.place + " " + selectedCard.title
                      )}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-lg"
                    />
                  </div>
                </div>

                {/* Right Side - Info */}
                <div className="w-full md:w-1/2 h-1/2 md:h-full p-8 text-white flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">
                          {selectedCard.title}
                        </h2>
                        <div className="flex items-center text-lg mb-3">
                          <FiMapPin className="mr-2" />
                          <span>{selectedCard.place}</span>
                        </div>
                        <div className="flex items-center gap-2 mb-4">
                          <RatingStars rating={selectedCard.rating} />
                          <span className="text-sm">
                            {selectedCard.rating} (
                            {selectedCard.reviews.toLocaleString()} reviews)
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="p-2 rounded-full hover:bg-white/20 transition"
                      >
                        <FiX size={24} />
                      </button>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <FiInfo className="mr-2" />
                        <h3 className="text-xl font-semibold">About</h3>
                      </div>
                      <p className="text-white/90 mb-4">
                        {selectedCard.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <a
                      href={`https://www.google.com/maps?q=${selectedCard.lat},${selectedCard.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition"
                    >
                      <span className="mr-2">View on Maps</span>
                      <FiExternalLink />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explore;
