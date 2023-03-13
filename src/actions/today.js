import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

/**
 * @name getMusic
 * @returns {string|Object}
 */
export function getMusic() {
  return async function (dispatch) {
    try {
      const success = await callApi.get(
        '/musicsday/today?category=626962053dcb17a8995789a1'
      );
      dispatch({ type: types.GET_TODAY_MUSIC_SUCCESS, game: success.data });
      return success.data;
    } catch (error) {
      console.log('>>> error', error);
      throw error.response;
    }
  };
}
