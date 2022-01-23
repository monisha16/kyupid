import React, {useState } from 'react';
import Header from '../Header/Header';
import Map from '../Map/Map';

const HomePage = () => {
    const [mapType, setMapType] = useState('pro');

    return ( 
        <div>
            <Header mapType={mapType} setMapType={setMapType}/>
            <Map mapType={mapType} />
        </div>
     );
}
 
export default HomePage;