import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import HeroImg from "../../assets/17.jpg";
import { FaHome } from "react-icons/fa";

const goToHome = () => {
  window.location.href = "/";
};

export default function TouristInfoForm() {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    preferredTransport: "",
    otherTransport: "",
    preferredTime: "",
    interests: [],
    additionalNotes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const interestsOptions = [
    "Jan-March",
    "April-July",
    "August-October",
    "Nov-Dec",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (interest) => {
    setFormData((prev) => {
      const newInterests = prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: newInterests };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/tourist-info",
        formData
      );

      setSubmitStatus({
        success: true,
        message: "Form submitted successfully!",
      });

      setFormData({
        name: "",
        location: "",
        preferredTransport: "",
        otherTransport: "",
        preferredTime: "",
        interests: [],
        additionalNotes: "",
      });
    } catch (error) {
      setSubmitStatus({
        success: false,
        message:
          error.response?.data?.message ||
          "Failed to submit form. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-[900px] flex justify-center items-center bg-cover bg-center p-4 relative"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent backdrop-blur-sm"></div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full max-w-lg bg-opacity-30 border-2 border-white shadow-lg rounded-2xl p-6 relative z-10 top-[-50px] font-merriweather"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Share Nearby Tourist Spots
        </h2>
        {submitStatus && (
          <div
            className={`mb-4 p-3 rounded-md ${
              submitStatus.success ? "bg-green-500/80" : "bg-red-500/80"
            } text-white text-center`}
          >
            {submitStatus.message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Place Name"
            className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all placeholder:text-white/70"
            required
          />

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location (City/Region)"
            className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all placeholder:text-white/70"
            required
          />

          <select
            name="preferredTransport"
            value={formData.preferredTransport}
            onChange={handleChange}
            className="bg-transparent text-white border border-white rounded px-3 py-2 w-full focus:ring-2 focus:ring-white"
            required
          >
            <option value="" disabled className="text-black">
              Preferred mode of Transportation
            </option>
            <option value="train" className="text-black">
              Train
            </option>
            <option value="flight" className="text-black">
              Flight
            </option>
            <option value="car" className="text-black">
              Car
            </option>
            <option value="others" className="text-black">
              Others
            </option>
          </select>

          {formData.preferredTransport === "others" && (
            <input
              type="text"
              name="otherTransport"
              value={formData.otherTransport}
              onChange={handleChange}
              placeholder="Specify other transport"
              className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all mt-2 placeholder:text-white/70"
              required={formData.preferredTransport === "others"}
            />
          )}

          <select
            name="preferredTime"
            value={formData.preferredTime}
            onChange={handleChange}
            className="bg-transparent text-white border border-white rounded px-3 py-2 w-full focus:ring-2 focus:ring-white"
            required
          >
            <option value="" disabled className="text-black">
              Preferred Time to Visit
            </option>
            <option value="morning" className="text-black">
              Morning
            </option>
            <option value="afternoon" className="text-black">
              Afternoon
            </option>
            <option value="evening" className="text-black">
              Evening
            </option>
          </select>

          <div>
            <p className="text-white font-medium">Preferred months:</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {interestsOptions.map((option) => (
                <label
                  key={option}
                  className="flex items-center space-x-2 text-white"
                >
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(option)}
                    onChange={() => handleCheckboxChange(option)}
                    className="rounded focus:ring-white"
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>

          <textarea
            name="additionalNotes"
            value={formData.additionalNotes}
            onChange={handleChange}
            placeholder="Additional Notes"
            className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all resize-none placeholder:text-white/70"
            rows="4"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-transparent text-white font-semibold py-2 px-4 rounded-md hover:bg-black transition-colors duration-200 flex items-center justify-center gap-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"} <Send size={18} />
          </button>
        </form>
        <motion.button
          onClick={goToHome}
          className="fixed bottom-8 right-8 z-50 p-3 bg-blue-400/20 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-blue-400/30 transition-colors duration-300"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Go to home"
        >
          <FaHome />
        </motion.button>
      </motion.div>
    </div>
  );
}
