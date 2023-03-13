import { useContext, useMemo } from 'react';

import { usersActions } from '../../actions';
import { UserContext } from '../../contexts/userContext';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';

import { AvatarSettings } from './';

const AvatarSettingsContainer = (ownProps) => {
  const { user } = useContext(UserContext);

  const otherProps = useMemo(
    () => ({
      user: user,
    }),
    [user]
  );

  const actions = useMemo(
    () => ({
      onUpdateUser: ({ avatar, avatarSettings }) => {
        return usersActions.updateUser(user._id, {
          avatar,
          avatarSettings,
        });
      },
    }),
    [user._id]
  );

  const actionsProps = useBindActionsCreator(actions);

  const enhancedProps = useMergeProps({
    ownProps,
    otherProps,
    actionsProps,
  });

  return <AvatarSettings {...enhancedProps} />;
};

export default AvatarSettingsContainer;
