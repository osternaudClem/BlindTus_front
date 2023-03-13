import { useMemo } from 'react';

import useMergeProps from '../../hooks/useMergeProps';

import { Scores } from './';

const ScoresContainer = ({ currentGame }) => {
  console.log('>>> currentGame 2', currentGame);

  const otherProps = useMemo(
    () => ({
      currentGame,
      totalScore: currentGame.reduce(
        (accumulator, game) => accumulator + game.score,
        0
      ),
    }),
    [currentGame]
  );

  const enhancedProps = useMergeProps({
    otherProps,
  });

  if (!currentGame._id) {
    return;
  }

  return <Scores {...enhancedProps} />;
};

export default ScoresContainer;
