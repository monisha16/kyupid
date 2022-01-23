import React, { useEffect, useState } from 'react';
import { fetch_users} from '../../Store/actions/kyupidAction';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ReactMapGL, { Source, Layer} from "react-map-gl";
import Dashboard from '../Dashboard/Dashboard';

const Map = (props) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(fetch_users());
    })
    const { revenueData, generalData } = useSelector((state) => {
        const states = {
            revenueData : state.kyupid.revenue_data,
            generalData: state.kyupid.general_data
        }
        return states;
    }); 

    let mapData;
    mapData = props.mapType === 'pro' ? 
         revenueData :  generalData
    
    
    const [viewport, setViewport] = useState({
        longitude: 77.47,
        latitude: 12.89,
        width: window.innerWidth,
        height: window.innerHeight,
        minZoom: 10,
        maxZoom: 10.8,
        pitch: 40,
        bearing: 340,        
    });
    const [areas, setAreas] = useState();
    const [showPopup, togglePopup] = useState(false);
    // const [popData, setPopData] = useState(null);
    const [regionalDash, setRegionalDash] = useState(null);

    useEffect(() => {

        (async function(){
            let revenueAreaData = {}; 
            let generalAreaData = {}; 
            await axios.get("https://kyupid-api.vercel.app/api/users")
            .then(res=>{
                let allUsers = res.data.users;
                let proUsers = allUsers.filter(user => {
                    return user.is_pro_user
                });
                    allUsers.forEach((user) => {
                        if (!(user.area_id in generalAreaData)) {
                            generalAreaData[user.area_id] =
                            {
                                "totalUsers": 0
                            };
                        }
                        else {
                            generalAreaData[user.area_id]["totalUsers"]++;
                        }
                    });

                    proUsers.forEach((user) => {
                        if (!(user.area_id in revenueAreaData)) {
                            revenueAreaData[user.area_id] =
                            {
                                "totalUsers": 0
                            };
                        }
                        else {
                            revenueAreaData[user.area_id]["totalUsers"]++;
                        }
                    });
            })

            await fetch("https://kyupid-api.vercel.app/api/areas")
                .then((res) => res.json())
                .then((new_areas) => {
                    new_areas["features"].forEach((area) => {
                    area["properties"]["totalProUsers"] = revenueAreaData[area.properties.area_id]["totalUsers"];
                    area["properties"]["totalGeneralUsers"] = generalAreaData[area.properties.area_id]["totalUsers"];
                    })
                    setAreas(new_areas)
                })
        })();
        
    }, []);


  const generalLayerStyle = {
    id: "area",
    type: "fill",
    paint: {
        // "fill-opacity": 0.7,
        "fill-outline-color": "rgb(52,51,50)", //#191a1a
        'fill-color': {
            property: 'totalGeneralUsers',
            stops: [
                [90,"#94f80b"],
                [120,"#93ff00"],
                [150,"#75e41c"],
                [170,'#54c527'],
                [200,"#40b02a"],
                [230,"#2c9b2a"],
                [250,"#198729"],
                [280,"#047326"]
            ]
        }
    }
  };
    const proLayerStyle = {
        id: "area",
        type: "fill",
        paint: {
            "fill-outline-color": "rgb(52,51,50)", //#191a1a
            'fill-color': {
                    property : 'totalProUsers',
                    stops:[
                   [ 0,
                    '#F2F12D'],
                    [50,
                    '#EED322'],
                   [ 70,
                    '#DA9C20'],
                    [120,
                    '#B86B25'],
                    [160,
                    '#8B4225'],
                    [260,
                    '#723122']
                    ]
            }
        }
        
    };
  
  return (
      <>
    <ReactMapGL
        doubleClickZoom={false}
        {...viewport}
        onViewportChange={(newviewport) => setViewport(newviewport)}
        mapStyle={"mapbox://styles/mapbox/dark-v9"}
        mapboxApiAccessToken={
            "pk.eyJ1Ijoibml0ZXNoc2g0cm1hIiwiYSI6ImNreHE4ZzJzdDFlYjMycHA3bXphYno3emcifQ.G690vt5K8bxhpPpyGLOEMA"
        }
        onHover={(e) => {
            if (e?.features[0]?.properties?.area_id) {
            // const userdata = getDetails(e.features[0].properties.area_id);
            let area_id = e.features[0].properties.area_id;
            setRegionalDash({
                female: mapData[area_id].female,
                male: mapData[area_id].male,
                totalUsers: mapData[area_id].totalUsers,
                totalMatches: mapData[area_id].total_matches,
                type:"region",
                areaName: e.features[0].properties.name,
                revPercentage: mapData[area_id].revPercentage,
            })
            // setPopData({
            //     longitude: e.lngLat[0],
            //     latitude: e.lngLat[1],
            //     data: {
            //         name: e.features[0].properties.name,
            //         users: mapData[area_id].totalUsers 
            //     }
            // });
           togglePopup(true);
        }
        
        else{
              togglePopup(false);
        }
      }}
    >
      {areas && 
        (<Source id="my-data" type="geojson" data={areas}>
        {props.mapType === "pro" ? <Layer {...proLayerStyle} /> : <Layer {...generalLayerStyle} />}
          {/* {showPopup && (
            <Popup                              
              latitude={popData.latitude}
              longitude={popData.longitude}
              closeButton={false}
            //   closeOnClick={false}
            //   onClose={() => togglePopup(false)}
              anchor="top"
            >
            <div className={styles['popup']}>
                <div className={styles['popup__heading']}>{`${popData.data.name}`}</div>
                <div className={styles['popup__text']}>{`Total Users - ${popData.data.users}`}</div>
            </div>
            </Popup>
          )} */}
        </Source>
      )}
    
    </ReactMapGL>
        {showPopup && regionalDash && <Dashboard type="region" mapType={props.mapType} data={regionalDash} />}
        {mapData.length !== 0 &&  <Dashboard type="total" mapType={props.mapType} data={mapData[0]} />}
    </>
    );
}

export default Map;