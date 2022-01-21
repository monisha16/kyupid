import React, { useEffect, useState } from 'react';
// import ReactMapGL, { Marker } from 'react-map-gl';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_users, fetch_area } from '../../Store/actions/kyupidAction';
import Header from '../Header/Header';
import styles from './homepage.module.scss';

const HomePage = () => {
    const dispatch = useDispatch();
    const [mapType, setMapType] = useState('revenue');

    // useEffect(() => {
    //      dispatch(fetch_area());
    //      dispatch(fetch_users());
    // }, []);

    // const { generalData, revenueData, areaCodeData, areas } = useSelector((state) => {
    //     const states = {
    //         generalData: state.kyupid.general_data,
    //         revenueData: state.kyupid.revenue_data,
    //         areaCodeData: state.kyupid.area_code_data,
    //         areas: state.kyupid.areas
    //     }
    //     return states;
    // })

    return ( 
        <div className={styles['kyupid-container']}>
            <Header mapType={mapType} setMapType={setMapType}/>
            <div>
                REST OF THE PAGE
            </div>
        </div>
     );
}
 
export default HomePage;