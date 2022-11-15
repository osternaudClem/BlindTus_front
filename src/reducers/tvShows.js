import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function tvShowsReducers(state = initialState.tvShows, action) {
  switch (action.type) {
    case types.GET_SHOWS_SUCCESS: {
      const shows = action.shows;

      return {
        ...state,
        all: shows,
      };
    }

    case types.FIND_SHOWS_SUCCESS: {
      const shows = action.shows;

      return {
        ...state,
        search: shows.results,
      };
    }

    case types.SAVE_SELECTED_SHOW_SUCCESS: {
      return {
        ...state,
        selected: action.show,
      };
    }

    case types.RESET_SHOW_SEARCH_SUCCESS: {
      return {
        ...state,
        found: [],
      };
    }

    default:
      return state;
  }
}
