import React, { useEffect, useState } from 'react';
// import ReactMapGL, { Marker } from 'react-map-gl';
// import Dashboard from '../dashboard/dashboard';
import { useDispatch, useSelector } from 'react-redux';
import { fetch_users, fetch_area } from '../../Store/actions/kyupidAction';

const HomePage = () => {
    const dispatch = useDispatch();

    useEffect(() => {
         dispatch(fetch_area());
         dispatch(fetch_users());
    }, []);

    const { generalData, revenueData, areaData } = useSelector((state) => {
        const states = {
            generalData: state.kyupid.general_data,
            revenueData: state.kyupid.revenue_data,
            areaData: state.kyupid.area_data
        }
        return states;
    })
    console.log("revenue Data: ", revenueData);
    console.log("generalData: ", generalData);
    console.log("areaData: ", areaData);
    return ( 
        <div>
            Main Page
        </div>
     );
}
 
export default HomePage;