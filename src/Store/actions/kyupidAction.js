import { FETCH_USERS, MAP_MODE, FETCH_AREA } from '../actionTypes';
import axios from 'axios';


export const fetch_area = () => async(dispatch) => {
    await axios.get(`https://kyupid-api.vercel.app/api/areas`)
        .then(res => {
            if (res.status === 200) {
                let areaData = {};
                res.data.features.forEach((area) => {
                    let areaId = area.properties.area_id;
                    areaData[areaId] = { ...area.properties };
                    areaData[areaId]['coordinates'] = [];
                    area.geometry.coordinates[0].forEach((coordinate) => {
                        areaData[areaId]['coordinates'].push({
                            lat: coordinate[1],
                            lng: coordinate[0],
                        });
                    });
                });
                dispatch({
                    type: FETCH_AREA,
                    payload: areaData,
                })
            }
        })
        .catch(err => {
            console.log("error while fetching area", err)
        });
}

export const fetch_users = () => async (dispatch) => {

    await axios.get(`https://kyupid-api.vercel.app/api/users`)
        .then(res => {
            if (res.status === 200) {
                let revenueData = {}; //Pro user data from Revenue map
                let generalData = {}; //user data for generalInfo map

                let allUsers = res.data.users;
                let proUsers = allUsers.filter(user => {
                    return user.is_pro_user
                });

                allUsers.forEach((user)=>{
                    if (!(user.area_id in generalData)) {
                        generalData[user.area_id] =
                        {
                            "totalUsers": 0,
                            "male": 0,
                            "female": 0,
                            "total_matches": 0,
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
                    if (!(user.area_id in revenueData)) 
                    {
                        revenueData[user.area_id] = 
                        {
                            "totalProUsers": 0,
                            "male": 0,
                            "female": 0,
                            "revenuePer" : 0,
                        };
                    }
                    else{
                        revenueData[user.area_id]["totalProUsers"] = revenueData[user.area_id]["totalProUsers"] + 1 ;
                        if (user.gender === 'M') revenueData[user.area_id]["male"]++ ;
                        else revenueData[user.area_id]["female"]++ ;
                        revenueData[user.area_id]["revenuePer"] = ((revenueData[user.area_id]["totalProUsers"] / proUsers.length)*100).toFixed(2);
                    }
                    
                });

                dispatch({
                    type: FETCH_USERS,
                    payload: { general: generalData, revenue: revenueData }
                })
            }
        })
        .catch(err => {
            console.log("error while fetching users", err)
        });
}
