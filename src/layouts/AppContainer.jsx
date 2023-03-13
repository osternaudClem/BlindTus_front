import { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getCookie } from 'react-use-cookie';
import { todayActions, usersActions } from '../actions';
import { Loading } from '../components/UI';

import { UserContext } from '../contexts/userContext';
import useBindActionsCreator from '../hooks/useBindActionsCreator';
import useMergeProps from '../hooks/useMergeProps';

import App from './App';

const AppController = ({ askToday, askUser, user, ...props }) => {
  const { updateUser } = useContext(UserContext);
  const userId = getCookie('user');

  useEffect(() => {
    askToday();
  }, [askToday]);

  useEffect(() => {
    if (userId) {
      askUser(userId);
    }
  }, [userId, askUser]);

  useEffect(() => {
    if (user) {
      updateUser(user);
    }
  }, [user, updateUser]);

  if (userId && !user._id) {
    return <Loading />;
  }

  return <App {...props} />;
};

const AppContainer = (ownProps) => {
  const selectedProps = useSelector((state) => ({
    user: state.users?.me,
  }));

  const actions = useMemo(
    () => ({
      askUser: (userId) => usersActions.getUserById(userId),
      askToday: () => todayActions.getMusic(),
    }),
    []
  );

  const actionsProps = useBindActionsCreator(actions);

  const otherProps = useMemo(() => ({}), []);

  const enhancedProps = useMergeProps({
    ownProps,
    selectedProps,
    actionsProps,
    otherProps,
  });

  return <AppController {...enhancedProps} />;
};

export default AppContainer;
