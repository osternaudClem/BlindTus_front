import classnames from 'classnames';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { useTextfield } from '../../hooks/formHooks';
import { isMediaAlreadyAdded } from '../../lib/check';
import { tmdb } from '../../config';

function SuggestMedia({ onAddMedia, type, findMedias, resetSearch, media }) {
  const [query, onChangeQuery, setField] = useTextfield();

  const onSearchMedia = async function (event) {
    event.preventDefault();
    if (query === '') {
      return;
    }

    findMedias(query);
  };

  const handleClickResetCode = function () {
    setField('');
  };

  const handleClickClear = function () {
    resetSearch();
    handleClickResetCode();
  };

  return (
    <Box sx={{ margin: '48px 0' }}>
      <form onSubmit={onSearchMedia}>
        <FormControl
          fullWidth
          sx={{ mb: 4 }}
        >
          <TextField
            label={`Tapez le nom de l'Œuvre`}
            variant="outlined"
            value={query}
            onChange={onChangeQuery}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="erase text field"
                    onClick={handleClickResetCode}
                    edge="end"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        {media.search.length > 0 && (
          <Button
            variant="contained"
            onClick={handleClickClear}
            sx={{ mb: 2 }}
          >
            Effacer la selection
          </Button>
        )}
      </form>

      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 16 }}
      >
        {media.search.map((movie) => {
          let isAlreadyAdded = isMediaAlreadyAdded(
            media[type].all,
            movie,
            type
          );

          return (
            <Grid
              item
              xs={2}
              sm={4}
              md={4}
              key={movie.id}
            >
              <Card
                sx={{ maxWidth: 365 }}
                className={classnames('MovieCard', {
                  'MovieCard--exist': isAlreadyAdded,
                })}
              >
                <CardMedia
                  component="img"
                  height="480"
                  image={tmdb.image_path + movie.poster_path}
                  alt={`Poster of ${movie.title} movie`}
                />

                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="div"
                  >
                    {movie.title || movie.name}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Date de sortie:{' '}
                    {(movie?.release_date &&
                      movie?.release_date?.slice(0, 4)) ||
                      movie?.first_air_date?.slice(0, 4)}
                  </Typography>
                </CardContent>

                <CardActions>
                  <Button
                    size="small"
                    onClick={() => onAddMedia(movie, type)}
                  >
                    Ajouter {type === 'movies' ? 'ce film' : 'cette série'}
                  </Button>
                </CardActions>

                {isAlreadyAdded && (
                  <Alert
                    variant="outlined"
                    severity="info"
                    className="MovieCard__info"
                  >
                    {type === 'movies' ? 'Film' : 'Série'} déjà ajouté !
                  </Alert>
                )}
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}

export default SuggestMedia;
