import { useSelector } from 'react-redux';

import useMergeProps from '../../hooks/useMergeProps';

import { ScoresDetails } from './';

const ScoresDetailsContainer = () => {
  const selectedProps = useSelector((state) => ({
    scores: state.scores.currentGame,
    totalScore: state.scores.currentGame.reduce(
      (accumulator, game) => accumulator + game.score,
      0
    ),
  }));

  const enhancedProps = useMergeProps({
    selectedProps,
  });

  return <ScoresDetails {...enhancedProps} />;
};

export default ScoresDetailsContainer;
