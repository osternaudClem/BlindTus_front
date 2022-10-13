import React, { useEffect, useState } from 'react';
import {
  Typography,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
} from '@mui/material';
import { red } from '@mui/material/colors';

import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import { MovieMusicCard } from '../Cards';

import { useToggle } from '../../hooks/formHooks';
import { callApi } from '../../lib/axios';

function ScoreItem({ score }) {
  const [open, onClickItem] = useToggle(false);
  const [movie, setMovie] = useState(null);
  const [music, setMusic] = useState(null);

  useEffect(() => {
    if (!movie) {
      (async function () {
        const movie = await callApi.get(`/movies/${score.movie_id}`);
        const music = await callApi.get(`/musics/${score.music_id}`);
        setMovie(movie.data);
        setMusic(music.data);
      })();
    }
  }, [movie, music, score]);

  if(!movie || !music) {
    return <div>Chargement...</div>
  }

  return (
    <div>
      {/* <MovieMusicCard movie={movie} music={music} /> */}
      <ListItem
        onClick={onClickItem}
        key={score.movie}
        secondaryAction={
          <Typography variant="body">{score.score}</Typography>
        }
      >
        <ListItemIcon>
          {score.isCorrect && (
            <CheckIcon color="success" />
          )}
          {!score.isCorrect && (
            <ClearIcon sx={{ color: red[500] }} />
          )}
        </ListItemIcon>
        <ListItemText
          primaryTypographyProps={{ noWrap: true }}
          primary={score.movie}
        />
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <MovieMusicCard movie={movie} music={music} />
      </Collapse>
      <Divider variant="middle" />
    </div>
  )
}

export default ScoreItem;