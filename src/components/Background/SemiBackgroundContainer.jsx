import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { moviesActions } from '../../actions';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';

import { SemiBackground } from './';

const SemiBackgroundContainer = (ownProps) => {
  const selectedProps = useSelector((state) => ({
    cover: state.movies?.cover,
  }));

  const actions = useMemo(
    () => ({
      getCover: () => moviesActions.getCover(),
    }),
    []
  );

  const actionsProps = useBindActionsCreator(actions);

  const enhancedProps = useMergeProps({
    ownProps,
    selectedProps,
    actionsProps,
  });

  return <SemiBackground {...enhancedProps} />;
};

export default SemiBackgroundContainer;
