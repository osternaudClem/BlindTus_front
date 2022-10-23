import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

/**
 * @name getMusic
 * @returns {string|Object}
 */
export function getMusic() {
  return async function (dispatch) {
    try {
      const success = await callApi.get('/musicsday/today');
      dispatch({ type: types.GET_TODAY_MUSIC_SUCCESS, game: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}
