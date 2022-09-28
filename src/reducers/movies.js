import * as types from '../datas/actionTypes';
import initialState from './initialState';
import { shuffle } from '../lib/array';

export default function moviesReducers(state = initialState.movies, action) {
  switch (action.type) {
    case types.SAVE_COVER_SUCCESS: {
      const movies = shuffle(action.movies);
      
      return {
        ...state,
        cover: movies[0].backdrop_path,
      }
    }

    default:
      return state;
  }
}