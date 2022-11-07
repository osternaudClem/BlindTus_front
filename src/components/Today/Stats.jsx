import { useContext } from 'react';
import { useReadLocalStorage } from 'usehooks-ts';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material';
import { UserContext } from '../../contexts/userContext';
import { decrypt } from '../../lib/crypt';

function Stats({ onClose }) {
  const { user } = useContext(UserContext);
  const storageStats = useReadLocalStorage('todayStats');
  let todayStats = {
    stats: {},
  };

  if (user._id) {
    const games = user.historyToday;
    for (let i = 1; i <= 5; i++) {
      todayStats.stats[i] = games.filter((g) => g.attempts.length === i).length;
    }

    todayStats.stats.notWin = games.filter((g) => !g.isCompleted).length;
    todayStats.totalGames = games.length;
    todayStats.totalWin = games.filter((g) => g.isWin).length;
  } else {
    todayStats = decrypt(storageStats);
  }

  return (
    <Dialog
      open
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>Statistiques</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          Parties : {todayStats.totalWin} / {todayStats.totalGames}
        </DialogContentText>
        <DialogContentText>1/5 : {todayStats.stats[1]}</DialogContentText>
        <DialogContentText>2/5 : {todayStats.stats[2]}</DialogContentText>
        <DialogContentText>3/5 : {todayStats.stats[3]}</DialogContentText>
        <DialogContentText>4/5 : {todayStats.stats[4]}</DialogContentText>
        <DialogContentText>5/5 : {todayStats.stats[5]}</DialogContentText>
        <DialogContentText>-/5 : {todayStats.stats.notWin}</DialogContentText>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          variant="contained"
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Stats;
