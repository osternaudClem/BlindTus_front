import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function historyTodayReducers(state = initialState.historyToday, action) {
  switch (action.type) {
    case types.GET_ALL_HISTORY_TODAY_SUCCESS: {      
      return {
        ...state,
        all: action.history,
      }
    }
    
    case types.GET_HISTORY_TODAY_SUCCESS: {      
      return {
        ...state,
        today: action.history,
      }
    }

    case types.SAVE_HISTORY_TODAY_SUCCESS: {
      console.log('>>> history', action.history);
      return {
        ...state,
        today: action.history,
      }
    }

    default:
      return state;
  }
}