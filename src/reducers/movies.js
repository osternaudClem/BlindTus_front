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

    case types.GET_ALL_MOVIES: {
      const movies = action.movies;

      return {
        ...state,
        all: movies,
      }
    }

    case types.FIND_MOVIES_SUCCESS: {
      const movies = action.movies;
      return {
        ...state,
        search: movies.results,
      }
    }

    case types.SAVE_SELECTED_MOVIE_SUCCESS: {
      return {
        ...state,
        selected: action.movie,
      };
    }

    case types.RESET_SELECTED_MOVIE_SUCCESS: {
      return {
        ...state,
        search: [],
      }
    }

    default:
      return state;
  }
}