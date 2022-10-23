import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

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

export function reset() {
  return async function (dispatch) {
    dispatch({ type: types.RESET_MUSICS_SUCCESS, musics: [] });
  };
}
