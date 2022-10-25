import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

/**
 * @name getMusics
 * @param {number} limit
 * @returns {string|Object[]}
 */
export function getMusics(limit) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/musics?limit=${limit}`);
      dispatch({ type: types.GET_MUSICS_SUCCESS, musics: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name suggestMusic
 * @param {Object} music
 * @returns {string|Object}
 */
export function suggestMusic(music) {
  return async function () {
    try {
      const success = await callApi.post(`/musics`, { music });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name reset
 * @returns {Object}
 */
export function reset() {
  return async function (dispatch) {
    dispatch({ type: types.RESET_MUSICS_SUCCESS, musics: [] });
  };
}
