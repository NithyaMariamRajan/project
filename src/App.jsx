import React from "react";
import Navbar from "./components/Navbar/Navbar";
import Hero from "./components/Hero/Hero";
import HeroImg from "./assets/16.jpg";
import Explore from "./components/Explore/Explore";
import Journal from "./components/Journal/Journal";
import Footer from "./components/Footer/Footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Mappage from "./components/Mappage/Mappage";
import TravelPlanner from "./components/TravelPlanner/TravelPlanner";
import Spotform from "./components/Forms/Spotform";
import Agentform from "./components/Forms/Agentform";
import Contribute from "./components/Forms/Contribute";
import Explorepage from "./components/Explore/Explorepage";

const bgImage = {
  backgroundImage: `url(${HeroImg})`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "bottom",
  backgroundSize: "cover",
  position: "relative",
};
const App = () => {
  return (
    <Router>
      <div className="overflow-x-hidden bg-brandDark text-white">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <div style={bgImage}>
                  <Navbar />
                  <Hero />
                </div>
                <Explore />
                <Journal />
                <Footer />
              </>
            }
          />

          <Route path="/mappage" element={<Mappage />} />
          <Route path="/travelplanner" element={<TravelPlanner />} />
          <Route path="/spotform" element={<Spotform />} />
          <Route path="/agentform" element={<Agentform />} />
          <Route path="/contribute" element={<Contribute />} />
          <Route path="/explorepage" element={<Explorepage />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
