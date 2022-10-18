import React from 'react';
import {
  Typography,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { GameRoundResults } from '../../components/Game';

function Results({ game, players, onNewGame }) {
  return (
    <Paper level={2}>
      <div style={{ padding: '16px' }}>
        <Button variant="contained" onClick={onNewGame}>Nouvelle partie</Button>
      </div>
      {game.movies && game.movies.map((movie, index) => {
        return (
          <div key={index} style={{ padding: '8px 16px' }}>
            <Typography component="h3" variant="h5">{movie}</Typography>
            {players.map(() => {
              return (
                <GameRoundResults game={game} players={players} musicNumber={index} minimize />
              )
            })}
            <Divider sx={{ marginTop: '8px' }} />
          </div>
        )
      })}

    </Paper>
  )
}

export default Results;