import { isToday, parseISO } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocalStorage } from 'usehooks-ts';

import useMergeProps from '../../hooks/useMergeProps';
import { decrypt, encrypt } from '../../lib/crypt';

import { TodayNotLogged } from './';

const TodayNotLoggedContainer = (ownProps) => {
  const [todayGames, setTodayGames] = useLocalStorage('todayGames', null);
  const [todayStats, setTodayStats] = useLocalStorage('todayStats', null);
  const [todayGamesLocal, setTodayGamesLocal] = useState(null);
  const [todayStatsLocal, setTodayStatsLocal] = useState(null);

  const selectedProps = useSelector((state) => {
    return {
      game: state.today?.game,
      state,
    };
  });

  useEffect(() => {
    let todayDecrypted = null;
    todayDecrypted = decrypt(todayGames);

    if (todayGames) {
      setTodayGamesLocal(decrypt(todayGames));
    }

    if (todayStats) {
      setTodayStatsLocal(decrypt(todayStats));
    }

    if (
      (!todayDecrypted || !isToday(parseISO(todayDecrypted.date))) &&
      selectedProps.game?.music
    ) {
      const today = {
        today: selectedProps.game.music._id,
        attempts: [],
        isCompleted: false,
        isWin: false,
        date: new Date(),
      };

      const token = encrypt(today);
      setTodayGamesLocal(today);
      setTodayGames(token);
    }
  }, [
    todayGames,
    todayStats,
    setTodayGamesLocal,
    setTodayStatsLocal,
    setTodayGames,
    selectedProps.game?.music,
  ]);

  const saveHistory = useCallback(
    (answer, isCorrect) => {
      const today = decrypt(todayGames);

      today.attempts.push(answer);
      today.isWin = isCorrect;
      today.isCompleted = isCorrect || today.attempts.length === 5;
      setTodayGamesLocal(today);

      setTodayGames(encrypt(today));

      if (today.isCompleted) {
        let newStats = {
          lastGame: new Date(),
        };

        if (todayStatsLocal) {
          newStats = {
            totalGames: parseInt(todayStatsLocal.totalGames) + 1,
            totalWin:
              parseInt(todayStatsLocal.totalWin) + (today.isWin ? 1 : 0),
            stats: todayStatsLocal.stats,
            ...newStats,
          };

          if (today.isWin) {
            newStats.stats[today.attempts.length] =
              parseInt(newStats.stats[today.attempts.length]) + 1;
          } else {
            newStats.stats.notWin = parseInt(newStats.stats.notWin) + 1;
          }
        } else {
          newStats = {
            totalGames: 1,
            totalWin: today.isWin ? 1 : 0,
            stats: {
              1: 0,
              2: 0,
              3: 0,
              4: 0,
              5: 0,
              notWin: 0,
            },
          };

          if (today.isWin) {
            newStats.stats[today.attempts.length] = 1;
          } else {
            newStats.stats.notWin = 1;
          }
        }

        setTodayStats(encrypt(newStats));
      }
    },
    [setTodayGames, setTodayStats, todayGames, todayStatsLocal]
  );

  const otherProps = {
    todayGames,
    todayStats,
    todayGamesLocal,
    todayStatsLocal,
    updateTodayGames: (game) => setTodayGames(game),
    updateTodayStats: (stats) => setTodayStats(stats),
    onSaveHistory: (answer, isCorrect) => saveHistory(answer, isCorrect),
  };

  const enhancedProps = useMergeProps({
    selectedProps,
    ownProps,
    otherProps,
  });

  return <TodayNotLogged {...enhancedProps} />;
};

export default TodayNotLoggedContainer;
