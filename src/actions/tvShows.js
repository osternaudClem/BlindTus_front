import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

export function getTVShows() {
  return async function (dispatch) {
    try {
      const success = await callApi.get('/tv-shows');
      dispatch({ type: types.GET_SHOWS_SUCCESS, shows: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function findTVShows(query) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/tv-shows/find/${query}`);
      dispatch({ type: types.FIND_SHOWS_SUCCESS, shows: success.data });
      return success.data;
    } catch (error) {
      return error.response;
    }
  };
}

export function saveSelectedTVShow(id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/movies/tv-shows/id/${id}`);
      dispatch({
        type: types.SAVE_SELECTED_SHOW_SUCCESS,
        show: success.data,
      });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function clearSelectedTVShow() {
  return async function (dispatch) {
    await dispatch({ type: types.SAVE_SELECTED_SHOW_SUCCESS, show: null });
    return {};
  };
}

export function suggestTVShow(tvShow) {
  return async function () {
    try {
      const success = await callApi.post('/tv-shows', {
        tvShow,
      });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name reset
 * @returns {string|Object}
 */
export function reset() {
  return async function (dispatch) {
    try {
      dispatch({ type: types.RESET_SHOW_SEARCH_SUCCESS, show: [] });
      return {};
    } catch (error) {
      throw error.response;
    }
  };
}
