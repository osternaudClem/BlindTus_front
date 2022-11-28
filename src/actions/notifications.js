import { callApi } from '../lib/axios';
import * as types from '../datas/actionTypes';

export function getNotifications(user_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.get(`/notifications/user/${user_id}`);
      dispatch({
        type: types.GET_NOTIFICATIONS_SUCCESS,
        notifications: success.data,
      });
      return success.data;
    } catch (error) {
      throw error.response;
    }
  };
}

export function markAsRead(notification_id, user_id) {
  return async function (dispatch) {
    try {
      const success = await callApi.patch('/notifications/mark-as-read', {
        notification_id,
        user_id,
      });

      dispatch({
        type: types.MARK_AS_READ_NOTIFICATION_SUCCESS,
        notification: success.data,
      });

      return success.data;
    } catch (error) {
      return error.response;
    }
  };
}
