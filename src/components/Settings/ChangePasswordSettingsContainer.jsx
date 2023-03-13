import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { usersActions } from '../../actions';
import { UserContext } from '../../contexts/userContext';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';

import { ChangePasswordSettings } from './';

const ChangePasswordSettingsContainer = (ownProps) => {
  const { user } = useContext(UserContext);

  const actions = useMemo(
    () => ({
      onChangePassword: ({ password, newPassword }) => {
        return usersActions.changePassword(user._id, {
          password,
          newPassword,
        });
      },
    }),
    [user._id]
  );

  const actionsProps = useBindActionsCreator(actions);

  const enhancedProps = useMergeProps({
    actionsProps,
  });

  return <ChangePasswordSettings {...enhancedProps} />;
};

export default ChangePasswordSettingsContainer;
