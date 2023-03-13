import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { setCookie } from 'react-use-cookie';

import { notificationsActions } from '../../actions';
import { UserContext } from '../../contexts/userContext';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';
import { getLevel } from '../../lib/levels';

import { Header, HeaderNotLogged } from './';

const HeaderContainer = (ownProps) => {
  const { user, updateUser } = useContext(UserContext);

  const selectedProps = useSelector((state) => ({
    notifications: state.notifications,
  }));

  const actions = useMemo(
    () => ({
      getNotifications: () => notificationsActions.getNotifications(user?._id),
      markNotificationAsRead: (notificationId) =>
        notificationsActions.markAsRead(notificationId, user?._id),
    }),
    [user?._id]
  );

  const actionsProps = useBindActionsCreator(actions);

  const otherProps = useMemo(
    () => ({
      level: user?.exp ? getLevel(user.exp) : null,
      onLogout: () => {
        setCookie('user', '', {
          days: 0,
          domain:
            !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
              ? ''
              : '.blindtus.com',
        });

        updateUser(null);
      },
    }),
    [user?.exp, updateUser]
  );

  const enhancedProps = useMergeProps({
    ownProps,
    selectedProps,
    actionsProps,
    otherProps,
  });

  return user?._id ? <Header {...enhancedProps} /> : <HeaderNotLogged />;
};

export default HeaderContainer;
