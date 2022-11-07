import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, Chip, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { tmdb } from '../../config';
import { addSpaces } from '../../lib/array.js';
import './Cards.scss';

function MovieCard({ movie, music, hideGenres, size }) {
  const largeScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));

  return (
    <Stack
      direction={largeScreen && size === 'large' ? 'row' : 'column'}
      spacing={2}
      className={`MovieCard MovieCard--${size}`}
    >
      <img
        src={`${tmdb.image_path}${movie.poster_path}`}
        alt={movie.title_fr}
        className="MovieCard__poster"
      />
      <div className="MovieCard__content">
        <Divider
          textAlign={largeScreen ? 'left' : 'center'}
          sx={{ marginBottom: '16px' }}
        >
          A propos du film
        </Divider>
        <Typography
          variant="h4"
          gutterBottom
        >
          {movie.title_fr}
        </Typography>
        <Typography
          variant="h5"
          gutterBottom
        >
          {addSpaces(movie.directors)}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
        >
          {movie.release_date}
        </Typography>
        {renderGenres()}

        {renderMusic()}
      </div>
    </Stack>
  );

  function renderGenres() {
    if (hideGenres) {
      return;
    }

    return (
      <div>
        {movie.genres.map((genre) => (
          <Chip
            label={genre}
            size="small"
            variant="outlined"
            key={genre}
          />
        ))}
      </div>
    );
  }

  function renderMusic() {
    if (!music) {
      return;
    }

    return (
      <React.Fragment>
        <Divider
          textAlign={largeScreen ? 'left' : 'center'}
          sx={{ margin: '16px 0' }}
        >
          A props de la musique
        </Divider>
        <Typography
          variant="h5"
          gutterBottom
        >
          {music.title}
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
        >
          de <b>{music.author}</b>
        </Typography>
      </React.Fragment>
    );
  }
}

MovieCard.propTypes = {
  hideGenres: PropTypes.bool,
  movie: PropTypes.object.isRequired,
  music: PropTypes.object,
  size: PropTypes.oneOf(['small', 'large']),
};

MovieCard.defaultProps = {
  hideGenres: false,
  music: null,
  size: 'large',
};

export default MovieCard;
