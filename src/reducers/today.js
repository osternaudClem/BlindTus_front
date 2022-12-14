import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function musicsReducers(state = initialState.today, action) {
  switch (action.type) {
    case types.GET_TODAY_MUSIC_SUCCESS: {
      const music = action.game.music;
      music.totalTodays = action.game.count;
      return {
        ...state,
        game: music,
      }
    }

    default:
      return state;
  }
}