import {combineReducers} from 'redux';
import shoppingListItems from './shoppingListItemReducer';

const rootReducer = combineReducers({
  // short hand property names
  shoppingListItems
})

export default rootReducer;