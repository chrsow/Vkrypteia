import { combineReducers } from 'redux';
import { NavigationActions } from 'react-navigation';
import user from './user';
import history from './history';
import contract from './contract';

const rootReducer = combineReducers({
  user,
  history,
  contract
});

export default rootReducer;