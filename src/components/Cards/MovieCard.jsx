import React from 'react';
import PropTypes from 'prop-types';
import { Typography, Divider, Chip, Stack } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';

import { tmdb } from '../../config';
import { addSpaces } from '../../lib/array.js';
import './Cards.scss';

function MovieCard({ music, hideGenres, size }) {
  const largeScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));

  const media = music.movie || music.tvShow;
  const type = music.movie ? 'movies' : 'tvShows';

  return (
    <Stack
      direction={largeScreen && size === 'large' ? 'row' : 'column'}
      spacing={2}
      className={`MovieCard MovieCard--${size}`}
    >
      <img
        src={`${tmdb.image_path}${media.poster_path}`}
        alt={media.title_fr}
        className="MovieCard__poster"
      />
      <div className="MovieCard__content">
        <Divider
          textAlign={largeScreen ? 'left' : 'center'}
          sx={{ marginBottom: '16px' }}
        >
          A propos {type === 'movies' ? 'du film' : 'de la série'}
        </Divider>
        <Typography
          variant="h4"
          gutterBottom
        >
          {media.title_fr}
        </Typography>
        {media.directors && (
          <Typography
            variant="h5"
            gutterBottom
          >
            {addSpaces(media.directors)}
          </Typography>
        )}
        <Typography
          variant="h6"
          gutterBottom
        >
          {media.release_date || media.first_air_date}
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
        {media.genres.map((genre) => (
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
  music: PropTypes.object,
  size: PropTypes.oneOf(['small', 'large']),
};

MovieCard.defaultProps = {
  hideGenres: false,
  music: null,
  size: 'large',
};

export default MovieCard;
