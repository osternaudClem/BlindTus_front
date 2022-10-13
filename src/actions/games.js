import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

export function saveGame(game) {
  return async function (dispatch) {
    try {
      const success = await callApi.post('/games', {
        ...game
      });
      dispatch({ type: types.ADD_GAME_SUCCESS, game: success.data });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function getGame(gameId) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/games/${gameId}`);
      dispatch({ type: types.GET_GAME_SUCCESS, game: success.data});
      return success.data;
    } catch (error) {
      throw error.response;
    }
  }
}

export function loadGame(gameId) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/games/${gameId}`);
      dispatch({ type: types.LOAD_GAME_SUCCESS, game: success.data});
      return success.data;
    } catch (error) {
      throw error.response;
    }
  }
}

export function reset() {
  return async function (dispatch) {
    await dispatch({ type: types.RESET_GAME_SUCCESS, game: {} });
    return {};
  }
}