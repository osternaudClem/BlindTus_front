import * as types from '../datas/actionTypes';

export function editSettings(datas) {
  return async function (dispatch) {
    await dispatch({ type: types.EDIT_GAME_SETTINGS_SUCCESS, settings: datas });
    return datas;
  };
}