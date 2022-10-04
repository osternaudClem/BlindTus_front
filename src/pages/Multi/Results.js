import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { socket } from '../../context/socket';
import {
  CssBaseline,
  Typography,
  Grid,
  Paper,
  Divider,
} from '@mui/material';

function Results(props) {
  const [game, setGame] = useState({});
  const [, setRoom] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const roomId = searchParams.get('room');

    socket.emit('GET_GAME', ({ roomId }), ({ game, room }) => {
      if (!game || !game.id) {
        return navigate('/lobby');
      }
      setGame(game);
      setRoom(room);
    });
  }, [navigate, searchParams]);

  const usersScore = [];

  if (game.users) {
    game.users.map(user => {
      let userScore = 0;

      game.rounds.map(round => {
        const newScore = round.scores.find(s => s.username === user.username);
        if (newScore) {
          userScore = userScore + newScore.score;
        }

        return null;
      });
      usersScore.push({ username: user.username, score: userScore });

      return null;
    });
  }

  return (
    <div>
      <CssBaseline />

      <Grid container alignItems="center">
        <Grid item xs>
          <Typography variant="h2">Fin de partie</Typography>
        </Grid>
        <Grid container spacing={12} component="main" className="LoginPage">
          <Grid
            item
            xs={12}
            sm={3}
            md={4}
          >
            <Paper level={2}>
              {usersScore.sort((a, b) => b.score - a.score).map(user => {
                return <div key={user.username}>{user.username}</div>
              })
              }
            </Paper>
          </Grid>
          <Grid
            item
            xs={12}
            sm={9}
            md={8}
          >
            <Paper level={2}>
              {game.movies && game.movies.map((movie, index) => {
                return (
                  <div key={movie} style={{ padding: '8px 16px' }}>
                    <div>{movie}</div>
                    {game.rounds[index].scores.map(score => {
                      return <div>{score.username}: {score.score}</div>
                    })}
                    <Divider sx={{ marginTop: '8px' }} />
                  </div>
                )
              })}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default Results;