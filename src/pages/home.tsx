import React from "react";
import "../styles/globals.css";
import CarouselDemo from "../components/Courses/Courses";
import Profile from "../pages/profile";

const Home: React.FC = () => {
  return (
    <div className="w-full flex flex-col md:flex-row overflow-scroll">
      <div className="w-full md:w-3/12 flex items-center justify-center overflow-scroll hide-scrollbar">
      <CarouselDemo />
      </div>
      <div className="w-full md:w-9/12 flex items-center justify-center overflow-scroll hide-scrollbar">
        <Profile />
      </div>
    </div>
  );
};

export default Home;
