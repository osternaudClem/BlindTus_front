import React from 'react';
import PropTypes from 'prop-types';
import {
  Typography,
  Divider,
  Chip,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2

import { tmdb } from '../../config';

function MovieCard({ movie, music, hideGenres }) {
  return (
    <Grid container spacing={2}>
      <Grid xs={3} className="Result__poster">
        <img src={`${tmdb.image_path}${movie.poster_path}`} alt={movie.title_fr} className="Result__poster__image" />
      </Grid>
      <Grid xs={9}>
        <Divider textAlign="left">A propos du film</Divider>
        <Typography variant="h4" gutterBottom>{movie.title_fr}</Typography>
        <Typography variant="h5" gutterBottom>{movie.directors}</Typography>
        <Typography variant="h6" gutterBottom>{movie.release_date}</Typography>
        {renderGenres()}
        
        {renderMusic()}
      </Grid>
    </Grid>
  )

  function renderGenres() {
    if (hideGenres) {
      return;
    }
    

    return (
      <div>
        {movie.genres.map(genre => <Chip label={genre} size="small" variant="outlined" key={genre} />)}
      </div>
    )
  }

  function renderMusic() {
    if (!music) {
      return;
    }

    return (
      <React.Fragment>
        <Divider textAlign="left">A props de la musique</Divider>
        <Typography variant="h5" gutterBottom>{music.title}</Typography>
        <Typography variant="h6" gutterBottom>de <b>{music.author}</b></Typography>
      </React.Fragment>
    )
  }
}

MovieCard.propTypes = {
  hideGenres: PropTypes.bool,
  movie: PropTypes.object.isRequired,
  music: PropTypes.object,
};

MovieCard.defaultProps = {
  hideGenres: false,
  music: null,
};

export default MovieCard;