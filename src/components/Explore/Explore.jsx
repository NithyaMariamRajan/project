import React, { useState } from "react";
import Img1 from "../../assets/18.jpg";
import Img2 from "../../assets/22.jpg";
import Img3 from "../../assets/23.jpg";
import { motion, AnimatePresence } from "framer-motion";
import { SlideUp } from "../../utility/animation";
import { FiX, FiMapPin, FiInfo, FiExternalLink, FiStar } from "react-icons/fi";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";

const ExploreData = [
  {
    id: 1,
    title: "Tea Plantations",
    place: "Munnar",
    url: "#",
    image: Img1,
    delay: 0.2,
    description:
      "Rolling hills covered with lush tea gardens, offering breathtaking views and cool mountain air.",
    location: "Munnar, Kerala 685612",
    lat: 10.0889,
    lng: 77.0595,
    rating: 4.7,
    reviews: 1284,
    highlights: ["Scenic Views", "Tea Tasting", "Photo Spots"],
  },
  {
    id: 2,
    title: "Athirapally Falls",
    place: "Chalakkudy",
    url: "#",
    image: Img2,
    delay: 0.4,
    description:
      "Majestic waterfall often called 'The Niagara of India', surrounded by lush green forests.",
    location: "Athirapally, Chalakudy, Kerala 680721",
    lat: 10.2846,
    lng: 76.5557,
    rating: 4.5,
    reviews: 892,
    highlights: ["Waterfall", "Nature Walk", "Wildlife"],
  },
  {
    id: 3,
    title: "Kollengode Palace",
    place: "Palakkad",
    url: "#",
    image: Img3,
    delay: 0.6,
    description:
      "Historic palace known for its traditional Kerala architecture and cultural significance.",
    location: "Kollengode, Palakkad, Kerala 678506",
    lat: 10.6139,
    lng: 76.7065,
    rating: 4.2,
    reviews: 456,
    highlights: [
      "Heritage Site",
      "Traditional Architecture",
      "Cultural Experience",
    ],
  },
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

  return (
    <>
      <section className="container" id="explore">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.2 }}
          className="text-center md:max-w-[650px] mx-auto space-y-4"
        >
          <p className="text-3xl">Explore Kerala</p>
          <p>
            Discover the most beautiful destinations in God's Own Country, from
            misty hills to cascading waterfalls.
          </p>
        </motion.div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 place-items-center">
          {ExploreData.map((data) => (
            <motion.div
              variants={SlideUp(data.delay)}
              initial="hidden"
              animate="visible"
              key={data.id}
              className="relative cursor-pointer group"
              onClick={() => setSelectedCard(data)}
            >
              <img
                src={data.image}
                alt=""
                className="w-[380px] h-[550px] object-cover group-hover:opacity-90 transition-opacity duration-300"
              />
              <div className="absolute w-full bottom-0 inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
                <div className="h-full space-y-2 py-6 flex flex-col justify-end items-center text-white px-4">
                  <h3 className="text-2xl font-semibold">{data.title}</h3>
                  <h3 className="uppercase mb-2">{data.place}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <button className="block mx-auto mt-6 text-brandBlue uppercase font-bold hover:underline">
          <a href="/explorepage">See More</a>
        </button>
      </section>

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

                      <div className="flex flex-wrap gap-2">
                        {selectedCard.highlights.map((highlight, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white/10 rounded-full text-sm"
                          >
                            {highlight}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold mb-3">Location</h3>
                      <p className="text-white/90">{selectedCard.location}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm">
                      <FiStar className="text-yellow-400" />
                      <span>Rate this place</span>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedCard.lat},${selectedCard.lng}`}
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
    </>
  );
};

export default Explore;
