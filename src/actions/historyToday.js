import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

/**
 * @name getFullHistory
 * @returns {string|Object[]}
 */
export function getFullHistory() {
  return async function (dispatch) {
    try {
      const success = await callApi.get('/historytoday');
      dispatch({
        type: types.GET_ALL_HISTORY_TODAY_SUCCESS,
        history: success.data,
      });
      return success.data;
    } catch (error) {
      return error.response;
    }
  };
}

/**
 * @name getHistory
 * @param {string} history_id
 * @returns {string|Object}
 */
export function getHistory(history_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/historytoday/${history_id}`);
      dispatch({
        type: types.GET_HISTORY_TODAY_SUCCESS,
        history: success.data,
      });
      return success.data;
    } catch (error) {
      return error.response;
    }
  };
}

/**
 * @name getTodayUser
 * @param {string} user_id
 * @returns {string|Object}
 */
export function getTodayUser(user_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/historytoday/user/${user_id}`);
      dispatch({
        type: types.GET_HISTORY_TODAY_SUCCESS,
        history: success.data,
      });
      return success.data;
    } catch (error) {
      return error.response;
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
      const success = await callApi.post('/historytoday', {
        ...history,
      });

      dispatch({
        type: types.SAVE_HISTORY_TODAY_SUCCESS,
        history: success.data,
      });

      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}
