import React, { useEffect, useState } from 'react';
import {
  Typography,
  Stack,
  Paper,
  Divider,
  Button,
} from '@mui/material';
import { UserAvatar } from '../../components/Avatar';

function Results({ game, players, onNewGame }) {
  return (
    <Paper level={2}>
      <Button variant="contained" onClick={onNewGame}>Noubelle partie</Button>
      {game.movies && game.movies.map((movie, index) => {
        return (
          <div key={movie} style={{ padding: '8px 16px' }}>
            <Typography component="h3" variant="h5">{movie}</Typography>
            {players.map((player, indexPlayer) => {
              return (
                <Stack direction="row" spacing={2} alignItems="center">
                  <UserAvatar avatar={player.info.avatar} username={player.username} displayUsername="right" />
                  <Typography variant="h6">{game.rounds[index].scores.find(s => s.username === player.username).score}</Typography>
                </Stack>
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