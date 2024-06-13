import React, { useEffect, useState, useMemo } from 'react';
import ReactMapGL, { Source, Layer } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import Dashboard from '../Dashboard/Dashboard';
import { areasData, userData } from '../../RawData/index.js';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass =
  // eslint-disable-next-line import/no-webpack-loader-syntax
  require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const Map = (props) => {
  const [viewport, setViewport] = useState({
    longitude: 77.47,
    latitude: 12.89,
    width: window.innerWidth,
    height: window.innerHeight,
    minZoom: 10,
    maxZoom: 10.8,
    pitch: 45,
    bearing: 340,
  });

  const [revenueData, setRevenueData] = useState();
  const [generalData, setGeneralData] = useState();
  const [areas, setAreas] = useState(areasData);
  const [showPopup, togglePopup] = useState(false);
  const [regionalDash, setRegionalDash] = useState(null);

  useEffect(() => {
    (async function () {
      let revenueData = {};
      let generalData = {};

      let allUsers = userData.users;
      let proUsers = allUsers.filter((user) => {
        return user.is_pro_user;
      });

      //total info for General Map
      let totalUsers = allUsers.length;

      let totalMaleUsers = allUsers.filter((user) => {
        return user.gender === 'M';
      }).length;

      let totalFemaleUsers = allUsers.filter((user) => {
        return user.gender === 'F';
      }).length;

      let totalMatches = allUsers.filter((user) => {
        return user.total_matches;
      }).length;

      //total info for Revenue Map
      let totalProUsers = proUsers.length;
      let totalMaleProUsers = proUsers.filter((user) => {
        return user.gender === 'M';
      }).length;
      let totalFemaleProUsers = proUsers.filter((user) => {
        return user.gender === 'F';
      }).length;
      let totalProMatches = proUsers.filter((user) => {
        return user.total_matches;
      }).length;
      let totalRevPercentage = ((totalProUsers / totalUsers) * 100).toFixed(1);

      allUsers.forEach((user) => {
        if (!(user.objectid in generalData)) {
          generalData[user.objectid] = {
            totalUsers: 0,
            male: 0,
            female: 0,
            total_matches: 0,
          };
        } else {
          generalData[user.objectid]['totalUsers']++;

          if (user.gender === 'M') generalData[user.objectid]['male']++;
          else generalData[user.objectid]['female']++;

          if (user.total_matches) generalData[user.objectid]['total_matches']++;
        }
      });

      proUsers.forEach((user) => {
        revenueData[user.objectid] = {
          totalUsers: 0,
          male: 0,
          female: 0,
          revPercentage: 0,
          total_matches: 0,
        };
        if (!(user.objectid in revenueData)) {
          revenueData[user.objectid]['totalUsers'] =
            revenueData[user.objectid]['totalUsers'] + 1;

          if (user.gender === 'M') revenueData[user.objectid]['male']++;
          else revenueData[user.objectid]['female']++;

          revenueData[user.objectid]['revPercentage'] = (
            (revenueData[user.objectid]['totalUsers'] / proUsers.length) *
            100
          ).toFixed(2);

          if (user.total_matches) revenueData[user.objectid]['total_matches']++;
        }
      });

      proUsers.forEach((user) => {
        if (!(user.objectid in revenueData)) {
          revenueData[user.objectid] = {
            totalUsers: 1,
            male: 1,
            female: 0,
            revPercentage: 0,
            total_matches: 0,
          };
        } else {
          revenueData[user.objectid]['totalUsers'] =
            revenueData?.[user.objectid]?.['totalUsers'] + 1 || 1;

          if (user.gender === 'M') revenueData[user.objectid]['male']++;
          else revenueData[user.objectid]['female']++;

          revenueData[user.objectid]['revPercentage'] = (
            (revenueData[user.objectid]['totalUsers'] / proUsers.length) *
            100
          ).toFixed(2);

          if (user.total_matches) revenueData[user.objectid]['total_matches']++;
        }
      });

      revenueData[0] = {
        totalUsers: totalProUsers,
        male: totalMaleProUsers,
        female: totalFemaleProUsers,
        total_matches: totalProMatches,
        totalRevPercentage: totalRevPercentage,
      };

      generalData[0] = {
        totalUsers: totalUsers,
        male: totalMaleUsers,
        female: totalFemaleUsers,
        total_matches: totalMatches,
      };

      setRevenueData(revenueData);
      setGeneralData(generalData);

      let new_areas = areasData;
      new_areas['features'].forEach((area) => {
        area['properties']['totalProUsers'] =
          revenueData[area.properties.objectid]['totalUsers'];
        area['properties']['totalGeneralUsers'] =
          generalData[area.properties.objectid]['totalUsers'];
      });
      setAreas(new_areas);
    })();
  }, []);

  let mapData;
  mapData = props.mapType === 'pro' ? revenueData : generalData;

  const generalLayerStyle = {
    id: 'area',
    type: 'fill',
    paint: {
      // 'fill-opacity': 0.8,
      'fill-outline-color': 'rgb(52,51,50)',
      'fill-color': {
        property: 'totalGeneralUsers',
        stops: [
          [90, '#94f80b'],
          [120, '#93ff00'],
          [150, '#75e41c'],
          [180, '#54c527'],
          [220, '#40b02a'],
          [250, '#2c9b2a'],
          [280, '#198729'],
          [300, '#047326'],
        ],
      },
    },
  };
  const proLayerStyle = {
    id: 'area',
    type: 'fill',
    source: 'my-data',
    paint: {
      // 'fill-opacity': 0.8,
      'fill-outline-color': 'rgb(52,51,50)',
      'fill-color': {
        property: 'totalProUsers',
        stops: [
          [0, '#F2F12D'],
          [50, '#EED322'],
          [80, '#DA9C20'],
          [120, '#B86B25'],
          [160, '#8B4225'],
          [200, '#723122'],
          [260, '#fc3401'],
        ],
      },
    },
  };

  const highlightLayerStyle = {
    id: 'area_highlight',
    type: 'fill-extrusion',
    paint: {
      'fill-extrusion-color':
        props.mapType === 'pro'
          ? {
              property: 'totalProUsers',
              stops: [
                [0, '#F2F12D'],
                [50, '#EED322'],
                [80, '#DA9C20'],
                [120, '#B86B25'],
                [160, '#8B4225'],
                [200, '#723122'],
                [260, '#fc3401'],
              ],
            }
          : {
              property: 'totalGeneralUsers',
              stops: [
                [90, '#94f80b'],
                [120, '#93ff00'],
                [150, '#75e41c'],
                [180, '#54c527'],
                [220, '#40b02a'],
                [250, '#2c9b2a'],
                [280, '#198729'],
                [300, '#047326'],
              ],
            },
      'fill-extrusion-height': 1000,
    },
  };

  function getCursor({ isHovering, isDragging }) {
    return isDragging ? 'grabbing' : isHovering ? 'pointer' : 'default';
  }
  const selectedArea = (regionalDash && regionalDash.objectid) || '';
  const filter = useMemo(
    () => ['in', 'objectid', selectedArea],
    [selectedArea]
  );

  return (
    <>
      <ReactMapGL
        doubleClickZoom={false}
        getCursor={getCursor}
        dragRotate={false}
        {...viewport}
        onViewportChange={(newviewport) => setViewport(newviewport)}
        mapStyle={'mapbox://styles/mapbox/dark-v9'}
        mapboxApiAccessToken={
          'pk.eyJ1Ijoibml0ZXNoc2g0cm1hIiwiYSI6ImNreHE4ZzJzdDFlYjMycHA3bXphYno3emcifQ.G690vt5K8bxhpPpyGLOEMA'
        }
        onHover={(e) => {
          if (e?.features[0]?.properties?.objectid) {
            let objectid = e.features[0].properties.objectid;
            setRegionalDash({
              female: mapData[objectid].female,
              male: mapData[objectid].male,
              totalUsers: mapData[objectid].totalUsers,
              totalMatches: mapData[objectid].total_matches,
              type: 'region',
              areaName: e.features[0].properties.name,
              revPercentage: mapData[objectid].revPercentage,
              objectid: objectid,
            });
            togglePopup(true);
          } else {
            togglePopup(false);
          }
        }}
      >
        {areas && (
          <Source id='my-data' type='geojson' data={areas}>
            {props.mapType === 'pro' ? (
              <Layer {...proLayerStyle} />
            ) : (
              <Layer {...generalLayerStyle} />
            )}
            {showPopup && <Layer {...highlightLayerStyle} filter={filter} />}
          </Source>
        )}
      </ReactMapGL>
      {showPopup && regionalDash && (
        <Dashboard type='region' mapType={props.mapType} data={regionalDash} />
      )}
      {mapData && mapData.length !== 0 && (
        <Dashboard type='total' mapType={props.mapType} data={mapData[0]} />
      )}
    </>
  );
};

export default Map;
