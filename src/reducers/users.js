import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function usersReducers(state = initialState.users, action) {
  switch (action.type) {
    case types.GET_USER_SUCCESS: {      
      return {
        ...state,
        me: action.user,
      }
    }

    default:
      return state;
  }
}