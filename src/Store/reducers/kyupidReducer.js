import { FETCH_USERS, FETCH_AREA } from '../actionTypes';

const initialState = {
    revenue_data: [],
    general_data: [],
    area_data : []
}

const KyupidReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                revenue_data : action.payload.revenue,
                general_data : action.payload.general
            }
        case FETCH_AREA:
            return {
                ...state,
                area_data : action.payload
            }
        default: return state
    }
}

export default KyupidReducer;