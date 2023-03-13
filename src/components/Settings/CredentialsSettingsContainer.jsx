import { useContext, useMemo } from 'react';

import { usersActions } from '../../actions';
import { UserContext } from '../../contexts/userContext';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';

import { CredentialsSettings } from './';

const CredentialsSettingsContainer = (ownProps) => {
  const { user } = useContext(UserContext);

  const actions = useMemo(
    () => ({
      onUpdate: ({ username, email }) => {
        return usersActions.updateUser(user._id, {
          username,
          email,
        });
      },
    }),
    [user]
  );

  const actionsProps = useBindActionsCreator(actions);

  const enhancedProps = useMergeProps({
    actionsProps,
  });

  return <CredentialsSettings {...enhancedProps} />;
};

export default CredentialsSettingsContainer;
