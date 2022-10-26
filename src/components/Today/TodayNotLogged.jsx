import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useLocalStorage } from 'usehooks-ts';
import { Container } from '@mui/material';
import { isToday } from '../../lib/date';
import { encrypt, decrypt } from '../../lib/crypt';
import { todayActions } from '../../actions';
import { Loading } from '../UI';
import { Today } from './';

function TodayNotLogged(props) {
  const [todayGames, setTodayGames] = useLocalStorage('todayGames', null);
  const [todayStats, setTodayStats] = useLocalStorage('todayStats', null);
  const [todayGamesLocal, setTodayGamesLocal] = useState(null);
  const [todayStatsLocal, setTodayStatsLocal] = useState(null);

  useEffect(() => {
    if (todayGames) {
      setTodayGamesLocal(decrypt(todayGames));
    }

    if (todayStats) {
      setTodayStatsLocal(decrypt(todayStats));
    }
  }, [todayGames, todayStats, setTodayGamesLocal, setTodayStatsLocal]);

  useEffect(() => {
    (async function () {
      if (!props.today.game) {
        const game = await props.todayActions.getMusic();
        let todayDecrypted = null;

        if (todayGames) {
          todayDecrypted = decrypt(todayGames);
        }

        if (!todayDecrypted || !isToday(todayDecrypted.date)) {
          const today = {
            today: game.music._id,
            attempts: [],
            isCompleted: false,
            isWin: false,
            date: new Date(),
          };

          const token = encrypt(today);
          setTodayGamesLocal(today);
          setTodayGames(token);
        }
      }
    })();
  }, [
    props.today.game,
    props.todayActions,
    todayGames,
    todayGamesLocal,
    setTodayGames,
  ]);

  const saveHistory = function (answer, isCorrect) {
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
          totalWin: parseInt(todayStatsLocal.totalWin) + (today.isWin ? 1 : 0),
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
  };

  if (!todayGamesLocal) {
    return <Loading />;
  }

  return (
    <div>
      <Container
        maxWidth="xl"
        className="Page"
      >
        <Today
          game={props.today.game}
          history={todayGamesLocal}
          onSaveHistory={saveHistory}
        />
      </Container>
    </div>
  );
}

function mapStateToProps(state) {
  return {
    today: state.today,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    todayActions: bindActionCreators(todayActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(TodayNotLogged);
