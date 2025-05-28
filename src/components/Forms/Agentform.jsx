import { useState } from "react";
import { Send } from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios"; // Add axios for API calls
import HeroImg from "../../assets/17.jpg";
import { FaHome } from "react-icons/fa";

const goToHome = () => {
  window.location.href = "/";
};

export default function TouristInfoForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    location: "",
    mobile: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/guides", // Your API endpoint
        formData
      );

      setSubmitStatus({
        success: true,
        message: "Thank you for registering as a guide!",
      });

      // Reset form after successful submission
      setFormData({
        name: "",
        age: "",
        gender: "",
        location: "",
        mobile: "",
        email: "",
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
          Be a Guide
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
            placeholder="Full Name"
            className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all"
            required
          />
          <input
            type="number"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="Age"
            className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all"
            required
          />

          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="bg-transparent text-white border border-white rounded px-3 py-2 w-full"
            required
          >
            <option value="" disabled className="text-black">
              Select Gender
            </option>
            <option value="Male" className="text-black">
              Male
            </option>
            <option value="Female" className="text-black">
              Female
            </option>
            <option value="Other" className="text-black">
              Other
            </option>
          </select>

          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all"
            required
          />

          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 bg-transparent border border-white rounded-md text-white focus:ring-2 focus:ring-white transition-all"
            required
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
