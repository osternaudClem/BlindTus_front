import * as types from '../datas/actionTypes';
import initialState from './initialState';

export default function notificationsReducers(
  state = initialState.notifications,
  action
) {
  switch (action.type) {
    case types.GET_NOTIFICATIONS_SUCCESS: {
      const notifications = action.notifications;

      return {
        ...state,
        all: notifications,
      };
    }

    case types.MARK_AS_READ_NOTIFICATION_SUCCESS: {
      return {
        ...state,
      };
    }

    default:
      return state;
  }
}
