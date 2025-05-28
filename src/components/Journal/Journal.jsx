import React from "react";
import Img1 from "../../assets/21.jpg";
import Img2 from "../../assets/20.jpg";
import { motion } from "framer-motion";
import { SlideUp } from "../../utility/animation";

const JournalData = [
  {
    id: 1,
    title: "An Unforgattable",
    about:
      "Serene Greens The rolling tea plantations of Munnar offer a breathtaking view of endless greenery. The fresh mountain air, misty hills, and the soothing aroma of tea make it a perfect escape into nature.",
    date: "May 30, 2024",
    url: "#",
    image: Img1,
    delay: 0.2,
  },
  {
    id: 2,
    title: "Symphonies in Steel",
    about:
      "Backwater Bliss Sailing through the serene backwaters of Alappuzha on a houseboat is a magical experience. The calm waters, lush greenery, and gentle breeze create the perfect getaway.",
    date: "JAN 30, 2025",
    url: "#",
    image: Img2,
    delay: 0.4,
  },
];

const Journal = () => {
  return (
    <>
      <section className="container mt-40" id="journal">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.2 }}
          className="text-center md:max-w-[650px] mx-auto space-y-4"
        >
          <p className="text-3xl">The Journal</p>
          <p>
            Our favorite stories about public lands and opportunities for you to
            go involved in protecting your outdoor experienced.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-14 place-items-center mt-20">
          {JournalData.map((data) => (
            <motion.div
              variants={SlideUp(data.delay)}
              initial="hidden"
              animate="visible"
              key={data.id}
            >
              <div className="overflow-hidden">
                <img
                  src={data.image}
                  alt=""
                  className="w-full h-[350px] object-cover"
                />
              </div>
              <div className="space-y-1 py-6 text-center px-12">
                <p className="uppercase">{data.date}</p>
                <p className="text-xl font-semibold font-merriweather">
                  {data.title}
                </p>
                <p className="!mt-8">{data.about}</p>
              </div>
            </motion.div>
          ))}
        </div>
        <button className="block mx-auto mt-6 text-brandBlue uppercase font-bold">
          All Post
        </button>
      </section>
    </>
  );
};

export default Journal;
