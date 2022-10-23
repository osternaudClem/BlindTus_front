import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

/**
 * @name saveGame
 * @param {Object} game
 * @returns {Object|string}
 */
export function saveGame(game) {
  return async function (dispatch) {
    try {
      const success = await callApi.post('/games', {
        ...game,
      });
      dispatch({ type: types.ADD_GAME_SUCCESS, game: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name getGame
 * @param {string} game_id
 * @returns {Object|string}
 */
export function getGame(game_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/games/${game_id}`);
      dispatch({ type: types.GET_GAME_SUCCESS, game: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

/**
 * @name loadGame
 * @param {string} game_id
 * @returns {Object|string}
 */
export function loadGame(game_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/games/${game_id}`);
      dispatch({ type: types.LOAD_GAME_SUCCESS, game: success.data });
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
    await dispatch({ type: types.RESET_GAME_SUCCESS, game: {} });
    return {};
  };
}
