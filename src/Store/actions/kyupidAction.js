import { FETCH_USERS} from '../actionTypes';
import axios from 'axios';


// export const fetch_area = () => async(dispatch) => {
//     await fetch(`https://kyupid-api.vercel.app/api/areas`)
//         .then((res) => res.json())
//         .then((new_areas) => 
//             {
//                 dispatch({
//                 type: FETCH_AREA,
//                 payload: { areas: new_areas},
//                 })
//             }
//         )
//         .catch(err => {
//             console.log("error while fetching area", err)
//         });
// }

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
                let totalMaleProUsers = proUsers.filter(user=>{
                    return user.gender === 'M'
                }).length;
                let totalFemaleProUsers = proUsers.filter(user => {
                    return user.gender === 'F'
                }).length;
                let totalProMatches = proUsers.filter(user => {
                    return user.total_matches
                }).length;
                let totalRevPercentage = ((totalProUsers / totalUsers) * 100).toFixed(1);
                
                allUsers.forEach((user)=>{
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
                    if (!(user.area_id in revenueData)) 
                    {
                        revenueData[user.area_id] = 
                        {
                            "totalUsers": 0,
                            "male": 0,
                            "female": 0,
                            "revPercentage" : 0,
                            "total_matches" : 0,
                        };
                    }
                    else{
                        revenueData[user.area_id]["totalUsers"] = revenueData[user.area_id]["totalUsers"] + 1 ;

                        if (user.gender === 'M') revenueData[user.area_id]["male"]++ ;
                        else revenueData[user.area_id]["female"]++ ;

                        revenueData[user.area_id]["revPercentage"] = ((revenueData[user.area_id]["totalUsers"] / proUsers.length)*100).toFixed(2);
                       
                        if (user.total_matches) revenueData[user.area_id]["total_matches"]++;
                    }
                    
                });
                revenueData[0]={
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
                // console.log("RD | GD", revenueData, generalData)
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
