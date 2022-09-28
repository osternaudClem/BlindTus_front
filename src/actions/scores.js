import * as types from '../datas/actionTypes';

export function addScore(datas) {
  return async function (dispatch) {
    await dispatch({ type: types.ADD_SCORE_SUCCESS, score: datas });
    return datas;
  };
}

export function reset() {
  return async function (dispatch) {
    await dispatch({ type: types.RESET_SCORE_SUCCESS, score: [] });
    return {};
  }
}