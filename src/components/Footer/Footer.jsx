import React from "react";
import FooterImg from "../../assets/14.png";
import { motion } from "framer-motion";

const bgImg = {
  backgroundImage: `url(${FooterImg})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
  backgroundSize: "cover",
};

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.2 }}
      style={bgImg}
      className="mt-16 h-[500px] bg-brandDark relative flex justify-center items-center text-white px-8"
      id="footer"
    >
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black z-10"></div>

      <div className="relative z-20 w-full max-w-7xl flex flex-wrap justify-between items-center gap-8">
        {/* Company Info */}
        <div className="max-w-sm">
          <h2 className="text-3xl font-bold flex font-greatVibes items-center gap-2">
            Spot On
          </h2>

          <p className="mt-3 text-gray-300">
            Your ultimate travel companion, weaving together adventure, history,
            and local flavors into a seamless journey. From real-time routes to
            hidden gems, it curates unforgettable experiences, guiding you
            through every moment with ease and excitement.
          </p>
        </div>

        <div className="max-w-sm">
          <h3 className="text-xl font-semibold">Subscribe to Our Newsletter</h3>
          <div className="mt-3 flex bg-transparent text-black">
            <input
              type="email"
              placeholder="Enter Your Email"
              className="p-3 rounded-l-full bg-orange-100 bg-opacity-35 text-white outline-none flex-1 placeholder:text-black/30"
            />
            <button className="p-3 px-6 rounded-r-full bg-orange-500 bg-opacity-35 text-white font-semibold">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <p className="absolute bottom-6 z-20 text-gray-400 text-sm">
        © 2024. All rights reserved | SpotOn
      </p>
    </motion.footer>
  );
};

export default Footer;
