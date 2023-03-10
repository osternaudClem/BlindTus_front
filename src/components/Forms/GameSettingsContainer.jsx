import { useMemo } from 'react';
import { useSelector } from 'react-redux';

import { categoriesActions, gamesActions } from '../../actions';
import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';

import { GameSettings } from './';

const GameSettingsContainer = (ownProps) => {
  const selectedProps = useSelector((state) => ({
    categories: state.categories?.all,
  }));

  const actions = useMemo(
    () => ({
      getGame: (code) => gamesActions.getGame(code),
      getCategories: () => categoriesActions.getCategories(),
    }),
    []
  );

  const actionsProps = useBindActionsCreator(actions);

  const enhancedProps = useMergeProps({
    ownProps,
    selectedProps,
    actionsProps,
  });

  return <GameSettings {...enhancedProps} />;
};

export default GameSettingsContainer;
