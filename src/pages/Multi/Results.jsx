import React from 'react';
import { Typography, Divider, Button } from '@mui/material';
import { GameRoundResults } from '../../components/Game';
import { PaperBox } from '../../components/UI';

function Results({ room, players, isCreator, onNewGame }) {
  return (
    <PaperBox>
      {isCreator && (
        <div style={{ padding: '16px' }}>
          <Button
            variant="contained"
            onClick={onNewGame}
          >
            Nouvelle partie
          </Button>
        </div>
      )}
      {room.musics &&
        room.musics.map((music, index) => {
          return (
            <div
              key={index}
              style={{ padding: '8px 16px' }}
            >
              <Typography
                component="h3"
                variant="h5"
              >
                {music.movie.title_fr}
              </Typography>

              <GameRoundResults
                room={room}
                players={players}
                round={index}
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
