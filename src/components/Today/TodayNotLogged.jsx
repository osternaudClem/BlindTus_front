import { Container } from '@mui/material';
import { Loading } from '../UI';
import { Today } from './';

function TodayNotLogged({
  game,
  todayGames,
  todayStats,
  todayGamesLocal,
  todayStatsLocal,
  updateTodayGames,
  updateTodayStats,
  onSaveHistory,
}) {
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
          game={game}
          history={todayGamesLocal}
          onSaveHistory={onSaveHistory}
        />
      </Container>
    </div>
  );
}

export default TodayNotLogged;
