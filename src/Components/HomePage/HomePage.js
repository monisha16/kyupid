import React, { useState } from 'react';
import Header from '../Header/Header';
import Map from '../Map/Map';
import Range from '../Range/Range';

const HomePage = () => {
  const [mapType, setMapType] = useState('pro');

  return (
    <div>
      <Header mapType={mapType} setMapType={setMapType} />
      <Map mapType={mapType} />
      <Range mapType={mapType} />
    </div>
  );
};

export default HomePage;
