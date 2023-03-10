import { useSelector } from 'react-redux';

import useMergeProps from '../../hooks/useMergeProps';

import { SuggestMusic } from './';

const SuggestMusicContainer = (ownProps) => {
  const selectedProps = useSelector((state) => ({
    movies: state.movies,
    tvShows: state.tvShows,
  }));

  const enhancedProps = useMergeProps({
    ownProps,
    selectedProps,
  });

  return <SuggestMusic {...enhancedProps} />;
};

export default SuggestMusicContainer;
