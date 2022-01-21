import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import 'mapbox-gl/dist/mapbox-gl.css';
import HomePage from './Components/HomePage/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route exact path={'/'} element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
