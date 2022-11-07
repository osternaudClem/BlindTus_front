import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { callApi } from '../../lib/axios';

function Stats({ onClose }) {
  const queryKey = ['history'];
  const { isLoading, data } = useQuery(queryKey, () =>
    callApi.get(`/historytoday/user/6329bcf462eb85395efa3320`)
  );

  let games = [];

  if (!isLoading) {
    games = data.data || [];
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
          Parties : {games.filter((g) => g.isWin).length} / {games.length}
        </DialogContentText>
        <DialogContentText>
          1/5 : {games.filter((g) => g.attempts.length === 1).length}
        </DialogContentText>
        <DialogContentText>
          2/5 : {games.filter((g) => g.attempts.length === 2).length}
        </DialogContentText>
        <DialogContentText>
          3/5 : {games.filter((g) => g.attempts.length === 3).length}
        </DialogContentText>
        <DialogContentText>
          4/5 : {games.filter((g) => g.attempts.length === 4).length}
        </DialogContentText>
        <DialogContentText>
          5/5 : {games.filter((g) => g.attempts.length === 5).length}
        </DialogContentText>
        <DialogContentText>
          -/5 : {games.filter((g) => !g.isCompleted).length}
        </DialogContentText>
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
