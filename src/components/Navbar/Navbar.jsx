import React from "react";
import Logo from "../../assets/logo.png";
import { SlideBottom } from "../../utility/animation";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
      <nav className="container flex flex-row justify-around items-center py-4 md:py-8 uppercase font-semibold relative z-20 text-xs md:text-lg ">
        <motion.a
          variants={SlideBottom(0)}
          initial="hidden"
          animate="visible"
          href="#footer"
        >
          About
        </motion.a>
        <motion.a
          variants={SlideBottom(0.2)}
          initial="hidden"
          animate="visible"
          href="#explore"
        >
          Explore
        </motion.a>
        <motion.a
          variants={SlideBottom(0.4)}
          initial="hidden"
          animate="visible"
          href="#"
        >
          {" "}
          <img src={Logo} alt="" className="w-14" />
        </motion.a>
        <motion.a
          variants={SlideBottom(0.6)}
          initial="hidden"
          animate="visible"
          href="#journal"
        >
          Journal
        </motion.a>
        <motion.a
          variants={SlideBottom(0.8)}
          initial="hidden"
          animate="visible"
          href="#"
        >
          <Link to="/contribute">Contribute</Link>
        </motion.a>
      </nav>
    </>
  );
};

export default Navbar;
