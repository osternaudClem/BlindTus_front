import axios from 'axios';
import { api } from '../config';
import * as types from '../datas/actionTypes';
const API = api[process.env.NODE_ENV];

export function saveGame(game) {
  return async function (dispatch) {
    try {
      const success = await axios.post(`${API}/games`, {
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
      const success = await axios.get(`${API}/games/${gameId}`);
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
      const success = await axios.get(`${API}/games/${gameId}`);
      dispatch({ type: types.LOAD_GAME_SUCCESS, game: success.data});
      return success.data;
    } catch (error) {
      throw error.response;
    }
  }
}