import { useMemo } from 'react';

import useMergeProps from '../../hooks/useMergeProps';

import { Scores } from './';

const ScoresContainer = ({ currentGameScores }) => {
  const otherProps = useMemo(
    () => ({
      currentGame: currentGameScores,
      totalScore: currentGameScores.reduce(
        (accumulator, game) => accumulator + game.score,
        0
      ),
    }),
    [currentGameScores]
  );

  const enhancedProps = useMergeProps({
    otherProps,
  });

  return <Scores {...enhancedProps} />;
};

export default ScoresContainer;
