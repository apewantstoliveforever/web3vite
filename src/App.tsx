import React from "react";

import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import Chat from "./pages/chat";
import Header from "./layouts/header";
import Footer from "./layouts/footer";
import './index.css'; // Include CSS here
import Test from "./pages/test";
import './styles/globals.css'; // Include CSS here
import TestSimplePeer from "./pages/test-simple-peer";
function App() {

  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path='/chat1' element={<Chat />} />
          <Route path='/chat2' element={<Chat />} />
          <Route path='/chat3' element={<Chat />} />
          <Route path='/test' element={<Test />} />
          <Route path='/test-peer' element={<TestSimplePeer />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
