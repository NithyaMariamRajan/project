import React, { useState } from "react";
import { motion } from "framer-motion";
import HeroImg from "../../assets/18.jpg";
import { FaHome } from "react-icons/fa";

const goToHome = () => {
  window.location.href = "/";
};

const KeralaTravelPlanner = () => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState(1);
  const [budget, setBudget] = useState("moderate");
  const [mood, setMood] = useState("relaxed");
  const [itinerary, setItinerary] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  const [showGuides, setShowGuides] = useState(false);
  const [guides, setGuides] = useState([]);
  const [isLoadingGuides, setIsLoadingGuides] = useState(false);
  const [guidesError, setGuidesError] = useState(null);

  const API_KEY = ""; //GEMINI API Key

  // Add fetchGuides function
  const fetchGuides = async () => {
    setIsLoadingGuides(true);
    setGuidesError(null);
    try {
      const response = await fetch("http://localhost:5000/api/guides");

      if (!response.ok) {
        throw new Error("Failed to fetch guides");
      }

      const data = await response.json();
      setGuides(data.data); // Note: Accessing data.data because of your API response structure
      setShowGuides(true);
    } catch (error) {
      setGuidesError(error.message);
      console.error("Error fetching guides:", error);
    } finally {
      setIsLoadingGuides(false);
    }
  };

  const generateItinerary = async () => {
    if (!destination.trim()) {
      setError("Please enter a destination");
      return;
    }
    setError(null);
    setIsGenerating(true);
    setItinerary(null);

    const prompt = `
Act as a highly knowledgeable travel expert. Create a comprehensive ${days}-day itinerary for ${destination} with these specifications:

Budget: ${budget} (specify if per person/couple/total)
Travel Mood: ${mood} (relaxed/adventurous/cultural/etc.)

ITINERARY REQUIREMENTS:

1. DAILY SCHEDULE:
   - Hour-by-hour or half-day activity blocks
   - Specific locations with addresses
   - Estimated travel times between locations
   - Weather contingency plans

2. DINING RECOMMENDATIONS:
   - 2-3 authentic Kerala restaurants per day
   - Signature dishes to try at each
   - Price range indicators (₹-₹₹₹)

3. TRANSPORTATION:
   - Best options between locations (taxi/bus/rickshaw/boat)
   - Estimated costs and travel durations
   - Booking tips if applicable

4. BUDGET BREAKDOWN:
   - Accommodation estimates
   - Food cost ranges
   - Activity/entrance fees
   - Transportation costs
   - Clearly mark estimates vs fixed prices

5. TRAVEL TIPS:
   - Packing suggestions 
   - ${mood}-specific recommendations
   - Local etiquette/customs to know
   - Safety considerations

6. ACCOMMODATION OPTIONS:
   - 2-3 lodging suggestions matching ${budget}
   - Brief highlights of each
   - Approximate nightly rates

FORMAT INSTRUCTIONS:
- Use numbered days (Day 1, Day 2 etc.)
- Bullet points for sub-items
- No markdown formatting
- Keep descriptions concise but informative
- Return only itinerary content
`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate itinerary");
      }

      const generatedText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Could not generate itinerary. Please try again.";

      // Clean up the response
      const cleanedItinerary = generatedText
        .split("\n")
        .filter((line) => line.trim() !== "")
        .map((line) => line.replace(/^\d+\.\s*/, "")); // Remove numbering if present

      setItinerary(cleanedItinerary);
    } catch (error) {
      console.error("API Error:", error);
      setError(error.message);
      setItinerary(["Failed to generate itinerary. Please try again later."]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center bg-cover bg-center relative p-4"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      {/* Background Blur Effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent backdrop-blur-sm"></div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="relative z-10 text-center mt-10"
      >
        <h1 className="text-4xl font-bold text-white drop-shadow-md">SpotOn</h1>
        <p className="text-lg text-white opacity-80">
          Plan your perfect getaway
        </p>
      </motion.div>

      {/* Content Cards */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="w-full max-w-4xl gap-6 mt-10 relative z-10"
      >
        {/* Trip Planning Card */}
        <div className="bg-white bg-opacity-20 border border-white rounded-2xl p-6 shadow-lg backdrop-blur-lg">
          <h2 className="text-xl font-semibold text-white mb-4">
            Plan Your Trip
          </h2>

          {error && (
            <div className="mb-4 p-2 bg-red-500/20 border border-red-500 rounded text-red-100">
              {error}
            </div>
          )}

          <label className="block text-white mb-2">Destination</label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Enter destination"
            className="w-full px-3 py-2 bg-transparent border border-white rounded text-white focus:ring-2 focus:ring-white"
          />

          <label className="block text-white mt-4 mb-2">
            Number of Days (1-14)
          </label>
          <input
            type="number"
            min="1"
            max="14"
            value={days}
            onChange={(e) => {
              const value = parseInt(e.target.value) || 1;
              setDays(Math.max(1, Math.min(14, value)));
            }}
            className="w-full px-3 py-2 bg-transparent border border-white rounded text-white focus:ring-2 focus:ring-white"
          />

          <label className="block text-white mt-4 mb-2">Budget Range</label>
          <select
            className="w-full px-3 py-2 bg-transparent border border-white rounded text-white focus:ring-2 focus:ring-white"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          >
            <option value="budget" className="text-gray-500">
              Budget
            </option>
            <option value="moderate" className="text-gray-500">
              Moderate
            </option>
            <option value="luxury" className="text-gray-500">
              Luxury
            </option>
          </select>

          <label className="block text-white mt-4 mb-2">Travel Mood</label>
          <select
            className="w-full px-3 py-2 bg-transparent border border-white rounded text-white focus:ring-2 focus:ring-white"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="relaxed" className="text-gray-500">
              Relaxed
            </option>
            <option value="adventurous" className="text-gray-500">
              Adventurous
            </option>
            <option value="cultural" className="text-gray-500">
              Cultural
            </option>
            <option value="family" className="text-gray-500">
              Family-friendly
            </option>
          </select>

          <button
            onClick={generateItinerary}
            disabled={!destination || isGenerating}
            className={`w-full mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-md transition-colors duration-200 ${
              !destination || isGenerating
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Itinerary"
            )}
          </button>
        </div>

        {/* Itinerary Display Card */}
        {itinerary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white bg-opacity-20 border border-white rounded-2xl p-6 shadow-lg backdrop-blur-lg mt-6"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">
                Your {days}-Day Itinerary for {destination}
              </h2>
              <button
                onClick={() => setItinerary(null)}
                className="text-white hover:text-gray-300"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-white">
              {itinerary.map((line, index) => (
                <div key={index} className="flex items-start">
                  <p>{line}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Home Button */}
      <motion.button
        onClick={goToHome}
        className="fixed bottom-8 right-8 z-50 p-3 bg-blue-400/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-blue-400/30 transition-colors duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Go to home"
      >
        <FaHome />
      </motion.button>

      {/* Guides Button */}
      <motion.button
        onClick={fetchGuides}
        className="fixed right-8 z-50 p-3 bg-purple-500/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-purple-500/30 transition-colors duration-300"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Get a guide"
        disabled={isLoadingGuides}
      >
        <div className="flex flex-col items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span className="text-xs mt-1">
            {isLoadingGuides ? "Loading..." : "Get Guide"}
          </span>
        </div>
      </motion.button>

      {/* Guides Modal */}
      {showGuides && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={() => setShowGuides(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white bg-opacity-90 rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">
                  Available Guides
                </h2>
                <button
                  onClick={() => setShowGuides(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {guidesError ? (
                <div className="text-red-500 p-4">{guidesError}</div>
              ) : guides.length === 0 ? (
                <div className="text-gray-500 p-4">No guides available</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Age
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Gender
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Contact
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {guides.map((guide) => (
                        <tr key={guide._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {guide.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guide.age}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guide.gender}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {guide.location}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{guide.mobile}</div>
                            <div className="text-blue-600">{guide.email}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default KeralaTravelPlanner;
