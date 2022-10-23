import * as types from '../datas/actionTypes';
import initialState from './initialState';
import { shuffle } from '../lib/array';

export default function musicsReducers(state = initialState.musics, action) {
  switch (action.type) {
    case types.GET_MUSICS_SUCCESS: {
      const musics = shuffle(action.musics);

      return {
        ...state,
        selection: musics,
      };
    }

    case types.RESET_MUSICS_SUCCESS: {
      return {
        ...state,
        selection: [],
      };
    }

    default:
      return state;
  }
}
