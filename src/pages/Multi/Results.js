import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { socket } from '../../context/socket';
import {
  CssBaseline,
  Typography,
  Grid,
  Paper,
} from '@mui/material';


function Results(props) {
  // const [game, setGame] = useState({
  //   "id": "277cccf8-d6ab-4ce6-9240-79a5e506e0ae",
  //   "room": "1878",
  //   "step": 0,
  //   "movies": [
  //     "Dead Silence",
  //     "X-Men",
  //     "Intouchables",
  //     "Backdraft",
  //     "The Truman Show"
  //   ],
  //   "rounds": [
  //     {
  //       "step": 0,
  //       "scores": [
  //         {
  //           "user": "lFLHphEXrJJ2nKckAAAP",
  //           "username": "Cl3tusTest",
  //           "score": 83
  //         },
  //         {
  //           "user": "4eFJewOCbFFmmLHbAAAF",
  //           "username": "Cl3tus",
  //           "score": 80
  //         }
  //       ]
  //     },
  //     {
  //       "step": 1,
  //       "scores": [
  //         {
  //           "user": "4eFJewOCbFFmmLHbAAAF",
  //           "username": "Cl3tus",
  //           "score": 0
  //         },
  //         {
  //           "user": "lFLHphEXrJJ2nKckAAAP",
  //           "username": "Cl3tusTest",
  //           "score": 60
  //         }
  //       ]
  //     },
  //     {
  //       "step": 2,
  //       "scores": [
  //         {
  //           "user": "4eFJewOCbFFmmLHbAAAF",
  //           "username": "Cl3tus",
  //           "score": 83
  //         },
  //         {
  //           "user": "lFLHphEXrJJ2nKckAAAP",
  //           "username": "Cl3tusTest",
  //           "score": 80
  //         }
  //       ]
  //     },
  //     {
  //       "step": 3,
  //       "scores": [
  //         {
  //           "user": "4eFJewOCbFFmmLHbAAAF",
  //           "username": "Cl3tus",
  //           "score": 83
  //         },
  //         {
  //           "user": "lFLHphEXrJJ2nKckAAAP",
  //           "username": "Cl3tusTest",
  //           "score": 77
  //         }
  //       ]
  //     },
  //     {
  //       "step": 4,
  //       "scores": [
  //         {
  //           "user": "lFLHphEXrJJ2nKckAAAP",
  //           "username": "Cl3tusTest",
  //           "score": 0
  //         },
  //         {
  //           "user": "4eFJewOCbFFmmLHbAAAF",
  //           "username": "Cl3tus",
  //           "score": 57
  //         }
  //       ]
  //     }
  //   ],
  //   "users": [
  //     {
  //       "id": "lFLHphEXrJJ2nKckAAAP",
  //       "username": "Cl3tusTest",
  //       "room": "1878",
  //       "isCreator": true,
  //       "scores": []
  //     },
  //     {
  //       "id": "4eFJewOCbFFmmLHbAAAF",
  //       "username": "Cl3tus",
  //       "room": "1878",
  //       "isCreator": false,
  //       "scores": []
  //     }
  //   ]
  // });
  const [game, setGame] = useState({});
  const [room, setRoom] = useState({});
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const roomId = searchParams.get('room');

    socket.emit('GET_GAME', ({ roomId }), ({ game, room }) => {
      console.log('>>> game', game);
      console.log('>>> room', room);
      if (!game || !game.id) {
        return navigate('/lobby');
      }
      setGame(game);
      setRoom(room);
    });
  }, []);

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
                  <div key={movie}>
                    <div>{movie}</div>
                    {game.rounds[index].scores.map(score => {
                      return <div>{score.username}: {score.score}</div>
                    })}
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