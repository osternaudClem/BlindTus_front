import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import { moviesActions, tvShowsActions } from '../../actions';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';

import { SuggestMedia } from './';

const SuggestMediaContainer = (ownProps) => {
  const { type } = ownProps;

  useEffect(() => {
    switch (type) {
      case 'tvShows':
        tvShowsActions.getTVShows();
        break;
      case 'movies':
      default:
        moviesActions.getAll();
    }
  }, [type]);

  const selectedProps = useSelector((state) => ({
    media: state[type],
  }));

  const actions = useMemo(
    () => ({
      findMedias: (query) => {
        switch (type) {
          case 'tvShows':
            return tvShowsActions.findTVShows(query);
          case 'movies':
          default:
            return moviesActions.findMovies(query);
        }
      },
      resetSearch: () => moviesActions.reset(),
    }),
    [type]
  );

  const actionsProps = useBindActionsCreator(actions);

  const enhancedProps = useMergeProps({
    ownProps,
    selectedProps,
    actionsProps,
  });

  return <SuggestMedia {...enhancedProps} />;
};

export default SuggestMediaContainer;
