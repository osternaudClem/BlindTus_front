import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { scoresActions } from '../../actions';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';

import useMergeProps from '../../hooks/useMergeProps';
import EndGame from './EndGame';

const EndGameContainer = (ownProps) => {
  const selectedProps = useSelector((state) => ({
    scores: state.scores?.currentGame,
    game: state.games?.currentGame,
    categories: state.categories?.all,
  }));

  const actions = useMemo(
    () => ({
      onResetScore: () => scoresActions.reset(),
    }),
    []
  );

  const actionsProps = useBindActionsCreator(actions);

  const enhancedProps = useMergeProps({
    selectedProps,
    actionsProps,
    ownProps,
  });

  return <EndGame {...enhancedProps} />;
};

export default EndGameContainer;
