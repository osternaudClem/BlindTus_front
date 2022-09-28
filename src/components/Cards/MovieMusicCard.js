import React from 'react';
import {
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import { tmdb } from '../../config';
import './Cards.scss';

function MovieMusicCard({ movie, music }) {
  return (
    <div
      className="MovieMusicCard"
    >
      <div className="MovieMusicCard__cover" style={{ backgroundImage: `url(${tmdb.image_path}${movie.backdrop_path})` }} />
      <Grid
        container
        spacing={2}
        className="MovieMusicCard"
        sx={{ margin: 0 }}
      >
        <Grid xs={6}>
          <Grid
            container
            spacing={1}
            className="MovieMusicCard"
            sx={{ margin: 0 }}
          >
            <Grid xs={4} className="MovieMusicCard__poster">
              <img src={`${tmdb.image_path}${movie.poster_path}`} alt={movie.title} className="MovieMusicCard__poster__image" />
            </Grid>
            <Grid xs={8}>
              <Typography variant="h3" gutterBottom>A propos du film</Typography>
              <Typography variant="h4" gutterBottom>{movie.title}</Typography>
              <Typography variant="h5" gutterBottom>{movie.directors}</Typography>
              <Typography variant="h6" gutterBottom>{movie.release_date}</Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid xs={6}>
          <Grid
            container
            spacing={1}
            className="MovieMusicCard"
            sx={{ margin: 0 }}
          >
            <Grid xs={4} className="MovieMusicCard__poster">
              <img src={`${tmdb.image_path}${movie.poster_path}`} alt={movie.title} className="MovieMusicCard__poster__image" />
            </Grid>
            <Grid xs={8}>
              <Typography variant="h4" gutterBottom>{movie.title}</Typography>
              <Typography variant="h5" gutterBottom>{movie.directors}</Typography>
              <Typography variant="h6" gutterBottom>{movie.release_date}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  )
}

export default MovieMusicCard;