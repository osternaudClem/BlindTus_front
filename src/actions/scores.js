import * as types from '../datas/actionTypes';

/**
 * @name addScore
 * @param {Object} datas
 * @returns {Object}
 */
export function addScore(datas) {
  return async function (dispatch) {
    await dispatch({ type: types.ADD_SCORE_SUCCESS, score: datas });
    return datas;
  };
}

/**
 * @name reset
 * @returns {Object}
 */
export function reset() {
  return async function (dispatch) {
    await dispatch({ type: types.RESET_SCORE_SUCCESS, score: [] });
    return {};
  };
}
