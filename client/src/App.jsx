import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import TherapyVideos from './pages/TherapyVideos';
import Blogs from './pages/Blogs';
import Shop from './pages/Shop';
import Gallery from './pages/Gallery';
import JoinUs from './pages/JoinUs';
import './index.css';

import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/videos" element={<TherapyVideos />} />
            <Route path="/blogs" element={<Blogs />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/join-us" element={<JoinUs />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
