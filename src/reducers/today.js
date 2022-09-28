import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function musicsReducers(state = initialState.today, action) {
  switch (action.type) {
    case types.GET_TODAY_MUSIC_SUCCESS: {
      
      return {
        ...state,
        game: action.game,
      }
    }

    default:
      return state;
  }
}