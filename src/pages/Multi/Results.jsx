import React from 'react';
import { Typography, Divider, Button } from '@mui/material';
import { GameRoundResults } from '../../components/Game';
import { PaperBox } from '../../components/UI';

function Results({ game, players, onNewGame }) {
  console.log('>>> game', game);
  console.log('>>> players', players);
  return (
    <PaperBox>
      <div style={{ padding: '16px' }}>
        <Button
          variant="contained"
          onClick={onNewGame}
        >
          Nouvelle partie
        </Button>
      </div>
      {game.movies &&
        game.movies.map((movie, index) => {
          return (
            <div
              key={index}
              style={{ padding: '8px 16px' }}
            >
              <Typography
                component="h3"
                variant="h5"
              >
                {movie}
              </Typography>

              <GameRoundResults
                game={game}
                players={players}
                musicNumber={index}
                minimize
              />
              <Divider sx={{ marginTop: '8px' }} />
            </div>
          );
        })}
    </PaperBox>
  );
}

export default Results;
