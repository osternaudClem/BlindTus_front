import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  gamesActions,
  historyActions,
  musicsActions,
  scoresActions,
} from '../../actions';

import useBindActionsCreator from '../../hooks/useBindActionsCreator';
import useMergeProps from '../../hooks/useMergeProps';
import NewGame from './NewGame';

const NewGameContainer = (ownProps) => {
  const [currentGameScores, setCurrentGameScores] = useState([]);

  const selectedProps = useSelector((state) => ({
    user: state.users?.me,
    musics: state.musics?.selection,
    game: state.games?.currentGame,
  }));

  const actions = useMemo(
    () => ({
      getMusics: (limit, categories) =>
        musicsActions.getMusics(limit, categories),
      getGame: (code) => gamesActions.getGame(code),
      onSaveGame: ({ time, difficulty, categories, musics }) =>
        gamesActions.saveGame({
          round_time: time,
          difficulty,
          musics,
          categories,
          created_by: selectedProps.user._id,
        }),

      onSaveHistory: () =>
        historyActions.saveHistory({
          scores: currentGameScores,
          user: selectedProps.user._id,
          game: selectedProps.game,
          totalScore: currentGameScores.reduce((accumulator, game) => {
            return accumulator + game.score;
          }, 0),
        }),
    }),
    [selectedProps.user._id, selectedProps.game, currentGameScores]
  );

  const actionsProps = useBindActionsCreator(actions);

  const otherProps = useMemo(
    () => ({
      currentGameScores,
      onSaveScore: async (music, isAnswerCorrect, score, answer) => {
        const newScore = {
          movie: (music.movie && music.movie.title_fr) || null,
          tvShow: (music.tvShow && music.tvShow.title_fr) || null,
          isCorrect: isAnswerCorrect,
          score: Math.round(score),
          playerAnswer: answer,
          movie_id: (music.movie && music.movie._id) || null,
          show_id: (music.tvShow && music.tvShow._id) || null,
          music_id: music._id,
        };

        setCurrentGameScores((g) => [...g, newScore]);
        scoresActions.addScore(newScore);
      },
    }),
    [currentGameScores]
  );

  const enhancedProps = useMergeProps({
    ownProps,
    selectedProps,
    actionsProps,
    otherProps,
  });

  return <NewGame {...enhancedProps} />;
};

export default NewGameContainer;
