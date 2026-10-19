import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/publico/home';  // Revisa la ruta de tu archivo
import Login from './sections/login'; // Importante tener creado Login.jsx

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}