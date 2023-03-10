import { useSelector } from 'react-redux';

import useMergeProps from '../../hooks/useMergeProps';

import { GameSettingsResume } from './';

const GameSettingsResumeContainer = (ownProps) => {
  const selectedProps = useSelector((state) => ({
    categories: state.categories?.all,
  }));

  const enhancedProps = useMergeProps({
    ownProps,
    selectedProps,
  });

  return <GameSettingsResume {...enhancedProps} />;
};

export default GameSettingsResumeContainer;
