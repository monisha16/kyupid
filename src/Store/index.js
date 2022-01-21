import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk'
import KyupidReducer from './reducers/kyupidReducer';

const rootReducers = combineReducers({
    kyupid: KyupidReducer
})
let store = createStore(rootReducers, applyMiddleware(thunk));
export default store;