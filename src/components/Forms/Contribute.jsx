import { motion } from "framer-motion";
import HeroImg from "../../assets/17.jpg";

export default function TouristInfoForm() {
  return (
    <div
      className="min-h-[900px] flex flex-col justify-center items-center bg-cover bg-center p-4 relative"
      style={{ backgroundImage: `url(${HeroImg})` }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent backdrop-blur-sm"></div>

      <h1 className="absolute top-10 text-5xl font-bold text-white text-center">
        Contribute
      </h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="w-full max-w-lg bg-opacity-30 shadow-lg rounded-2xl p-6 relative z-10 mt-16 font-merriweather text-center"
      >
        <div className="flex justify-center items-center space-x-6">
          <button className="px-8 py-4 text-2xl font-bold border-2 border-white text-white bg-transparent rounded-lg shadow-md hover:bg-white hover:text-black transition duration-300">
            <a href="/agentform">Be a Guide</a>
          </button>
          <button className="px-8 py-4 text-2xl font-bold border-2 border-white text-white bg-transparent rounded-lg shadow-md hover:bg-white hover:text-black transition duration-300">
            <a href="/spotform">Add a Spot</a>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
