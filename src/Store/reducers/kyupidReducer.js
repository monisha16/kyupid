import { FETCH_USERS} from '../actionTypes';

const initialState = {
    revenue_data: [],
    general_data: [],
}

const KyupidReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                revenue_data : action.payload.revenue,
                general_data : action.payload.general
            }
        default: return state
    }
}

export default KyupidReducer;