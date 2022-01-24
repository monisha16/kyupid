import React, { useEffect, useState,useMemo} from 'react';
import axios from 'axios';
import ReactMapGL, { Source, Layer} from "react-map-gl";
import mapboxgl from 'mapbox-gl';
import Dashboard from '../Dashboard/Dashboard';
import Range from '../Range/Range';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const Map = (props) => {
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
    const [revenueData, setRevenueData] =  useState();
    const [generalData, setGeneralData] = useState();
    const [areas, setAreas] = useState();
    const [showPopup, togglePopup] = useState(false);
    const [regionalDash, setRegionalDash] = useState(null);

    useEffect(() => {
        (async function(){
            let revenueData = {}; 
            let generalData = {}; 
            await axios.get("https://kyupid-api.vercel.app/api/users")
            .then(res=>{
                let allUsers = res.data.users;
                let proUsers = allUsers.filter(user => {
                    return user.is_pro_user
                });

                //total info for General Map
                let totalUsers = allUsers.length;
                let totalMaleUsers = allUsers.filter(user => {
                    return user.gender === 'M'
                }).length;
                let totalFemaleUsers = allUsers.filter(user => {
                    return user.gender === 'F'
                }).length;
                let totalMatches = allUsers.filter(user => {
                    return user.total_matches
                }).length;

                //total info for Revenue Map
                let totalProUsers = proUsers.length;
                let totalMaleProUsers = proUsers.filter(user => {
                    return user.gender === 'M'
                }).length;
                let totalFemaleProUsers = proUsers.filter(user => {
                    return user.gender === 'F'
                }).length;
                let totalProMatches = proUsers.filter(user => {
                    return user.total_matches
                }).length;
                let totalRevPercentage = ((totalProUsers / totalUsers) * 100).toFixed(1);

                allUsers.forEach((user) => {
                    if (!(user.area_id in generalData)) {
                        generalData[user.area_id] =
                        {
                            "totalUsers": 0,
                            "male": 0,
                            "female": 0,
                            "total_matches": 0
                        };
                    }
                    else {
                        generalData[user.area_id]["totalUsers"]++;

                        if (user.gender === 'M') generalData[user.area_id]["male"]++;
                        else generalData[user.area_id]["female"]++;

                        if (user.total_matches) generalData[user.area_id]["total_matches"]++;
                    }
                });
                proUsers.forEach((user) => {
                    if (!(user.area_id in revenueData)) {
                        revenueData[user.area_id] =
                        {
                            "totalUsers": 0,
                            "male": 0,
                            "female": 0,
                            "revPercentage": 0,
                            "total_matches": 0,
                        };
                    }
                    else {
                        revenueData[user.area_id]["totalUsers"] = revenueData[user.area_id]["totalUsers"] + 1;

                        if (user.gender === 'M') revenueData[user.area_id]["male"]++;
                        else revenueData[user.area_id]["female"]++;

                        revenueData[user.area_id]["revPercentage"] = ((revenueData[user.area_id]["totalUsers"] / proUsers.length) * 100).toFixed(2);

                        if (user.total_matches) revenueData[user.area_id]["total_matches"]++;
                    }

                });
                revenueData[0] = {
                    "totalUsers": totalProUsers,
                    "male": totalMaleProUsers,
                    "female": totalFemaleProUsers,
                    "total_matches": totalProMatches,
                    "totalRevPercentage": totalRevPercentage,
                }
                generalData[0] = {
                    "totalUsers": totalUsers,
                    "male": totalMaleUsers,
                    "female": totalFemaleUsers,
                    "total_matches": totalMatches
                }

                setRevenueData(revenueData);
                setGeneralData(generalData);
            })

            await fetch("https://kyupid-api.vercel.app/api/areas")
                .then((res) => res.json())
                .then((new_areas) => {
                    new_areas["features"].forEach((area) => {
                    area["properties"]["totalProUsers"] = revenueData[area.properties.area_id]["totalUsers"];
                    area["properties"]["totalGeneralUsers"] = generalData[area.properties.area_id]["totalUsers"];

                })
                    setAreas(new_areas)
                })
        })();
        
    }, []);


    let mapData;
    mapData = props.mapType === 'pro' ?
        revenueData : generalData

    const generalLayerStyle = {
        id: "area",
        type: "fill",
        paint: {
        // "fill-opacity": 0.7,
        "fill-outline-color": "rgb(52,51,50)", 
        'fill-color': {
            property: 'totalGeneralUsers',
            stops: [
                [90,"#94f80b"],
                [120,"#93ff00"],
                [150,"#75e41c"],
                [180,'#54c527'],
                [220,"#40b02a"],
                [250,"#2c9b2a"],
                [280,"#198729"],
                [300,"#047326"]
            ]
        }}
    };
    const proLayerStyle = {
        id: "area",
        type: "fill",
        paint: {
            // "fill-opacity": 0.7,
            "fill-outline-color": "rgb(52,51,50)", 
            'fill-color': {
                property : 'totalProUsers',
                stops:  [
                        [0,'#F2F12D'],
                        [50,'#EED322'],
                        [80,'#DA9C20'],
                        [120,'#B86B25'],
                        [160,'#8B4225'],
                        [200,'#723122'],
                        [260,'#fc3401']
                ]
            }
        },
    };

    const highlightLayerStyle = {
        id: "area_highlight",
        type: "fill",
        paint: {
            "fill-opacity": .4,
            'fill-color': 'white',
        },
    };
    

    function getCursor({ isHovering, isDragging }) {
        return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default';
    }
    const selectedArea = (regionalDash && regionalDash.area_id) || '';
    const filter = useMemo(() => ['in', 'area_id', selectedArea], [selectedArea]);


    return (
    <>
    <ReactMapGL
        doubleClickZoom={false}
        getCursor={getCursor}
        dragRotate={false}
        {...viewport}
        onViewportChange={(newviewport) => setViewport(newviewport)}
        mapStyle={"mapbox://styles/mapbox/dark-v9"}
        mapboxApiAccessToken={
            "pk.eyJ1Ijoibml0ZXNoc2g0cm1hIiwiYSI6ImNreHE4ZzJzdDFlYjMycHA3bXphYno3emcifQ.G690vt5K8bxhpPpyGLOEMA"
        }

        onHover={(e) => {
            if (e?.features[0]?.properties?.area_id) 
            {
                let area_id = e.features[0].properties.area_id;
                setRegionalDash({
                    female: mapData[area_id].female,
                    male: mapData[area_id].male,
                    totalUsers: mapData[area_id].totalUsers,
                    totalMatches: mapData[area_id].total_matches,
                    type: "region",
                    areaName: e.features[0].properties.name,
                    revPercentage: mapData[area_id].revPercentage,
                    area_id: area_id,
                });
                togglePopup(true);
            }
            else {
                togglePopup(false);
            }
        }}
    >
        {areas && 
            <Source id="my-data" type="geojson" data={areas}>
                {props.mapType === "pro" ? <Layer {...proLayerStyle}  />
                    : <Layer {...generalLayerStyle}  />
                }
                {showPopup && <Layer {...highlightLayerStyle} filter={filter} />}
            </Source>
        }
    
    </ReactMapGL>
        {showPopup && regionalDash && <Dashboard type="region" mapType={props.mapType} data={regionalDash} />}
        {mapData && mapData.length !== 0 &&  <Dashboard type="total" mapType={props.mapType} data={mapData[0]} />}
    </>
    );
}

export default Map;