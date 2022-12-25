import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

/**
 * @name getFullHistory
 * @param {string} user_id
 * @returns {string|Object[]}
 */
export function getFullHistory(user_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/history?user=${user_id}`);
      dispatch({ type: types.GET_HISTORY_SUCCESS, history: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name saveHistory
 * @param {Object} history
 * @returns {string|Object}
 */
export function saveHistory(history) {
  return async function (dispatch) {
    try {
      const success = await callApi.post('/history', {
        ...history,
      });

      dispatch({ type: types.ADD_HISTORY_SUCCESS, history: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}
