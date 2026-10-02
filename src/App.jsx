import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home/Home';
import Locations from './components/Locations/Locations';
import Franchise from './components/Franchise/Franchise';
import Menu from './components/Menu/Menu';
import About from './components/About/About';
import './App.css';

function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/franchise" element={<Franchise />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
