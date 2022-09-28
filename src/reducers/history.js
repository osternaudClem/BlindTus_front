import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function historyReducers(state = initialState.history, action) {
  switch (action.type) {
    case types.GET_HISTORY_SUCCESS: {      
      return {
        ...state,
        all: action.history,
      }
    }

    case types.ADD_HISTORY_SUCCESS: {
      return {
        ...state,
      }
    }

    default:
      return state;
  }
}