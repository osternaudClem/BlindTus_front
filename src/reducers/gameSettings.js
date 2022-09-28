import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function gameSettingsReducers(state = initialState.gameSettings, action) {
  switch (action.type) {
    case types.EDIT_GAME_SETTINGS_SUCCESS: {
      return {
        ...state,
        ...action.settings,
      }
    }

    default:
      return state;
  }
}