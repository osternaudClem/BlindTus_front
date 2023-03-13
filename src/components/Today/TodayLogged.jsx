import { Today } from './';
import { Loading } from '../UI';
import { useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/userContext';

function TodayLogged({ game, historyToday, onUpdateHistory }) {
  const { updateUser } = useContext(UserContext);
  useEffect(() => {
    if (!historyToday) {
      onUpdateHistory({ today: game._id });
    }
  }, [game._id, historyToday, onUpdateHistory]);

  const saveHistory = async function (answer, isCorrect) {
    const attempts = historyToday?.attempts
      ? JSON.parse(JSON.stringify(historyToday.attempts))
      : [];
    attempts.push(answer);

    const data = await onUpdateHistory({
      ...historyToday,
      today: game._id,
      attempts,
      isWin: isCorrect,
      isCompleted: isCorrect || historyToday?.attempts?.length === 4,
    });

    updateUser(data.user);
  };

  if (!game._id || !historyToday) {
    return <Loading />;
  }

  return (
    <Today
      onSaveHistory={saveHistory}
      game={game}
      history={historyToday}
    />
  );
}

export default TodayLogged;
