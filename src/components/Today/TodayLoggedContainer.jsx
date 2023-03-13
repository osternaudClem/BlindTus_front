import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { historyTodayActions } from '../../actions';
import { UserContext } from '../../contexts/userContext';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';

import { TodayLogged } from './';

const TodayLoggedContainer = (ownProps) => {
  const { user, updateUser } = useContext(UserContext);

  const selectedProps = useSelector((state) => {
    return {
      game: state.today?.game,
      historyToday: state.historyToday?.today?.history,
    };
  });

  const actions = useMemo(
    () => ({
      onUpdateHistory: (history) =>
        historyTodayActions.saveHistory({ ...history, user: user._id }),

      // console.log('>>> data', data);
      // updateUser(data.)
      // return data;
    }),
    [user._id]
  );

  const actionsProps = useBindActionsCreator(actions);
  const enhancedProps = useMergeProps({
    selectedProps,
    ownProps,
    actionsProps,
  });

  return <TodayLogged {...enhancedProps} />;
};

export default TodayLoggedContainer;
