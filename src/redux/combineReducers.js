import { combineReducers } from 'redux';
import groupsReducer from './groupReduser';
import memberReducer from './memberReducers'

const rootReducer = combineReducers({
  groups: groupsReducer,
  members: memberReducer
});

export default rootReducer;
