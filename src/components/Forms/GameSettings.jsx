import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Slider,
  Typography,
  TextField,
  Grid,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  Divider,
  InputAdornment,
  IconButton,
  Alert,
  AlertTitle,
  FormGroup,
  Checkbox,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSlider, useTextfield } from '../../hooks/formHooks';
import { Loading, PaperBox } from '../UI';

const NOVIE_NUMBER = 10;
const MOVIE_MIN = 3;
const MOVIE_MAX = 100;

function valuetext(value) {
  return `${value} secondes`;
}

function GameSettings({
  onSettingsSaved,
  onSettingsChange,
  redirect,
  room,
  noGameCode,
  categories,
  getCategories,
  getGame,
}) {
  const [errorCode, setErrorCode] = useState(null);
  const [time, updateTime] = useSlider(
    (room.settings && room.settings.time_limit) || 30
  );
  const [movieNumber, updateMovieNumber] = useTextfield(
    (room.settings && room.settings.total_musics) || NOVIE_NUMBER
  );
  const [difficulty, updateDifficulty] = useTextfield(
    (room.settings && room.settings.difficulty) || 'easy'
  );
  const [selectedCategories, updateSelectedCategories] = useState({});
  const [code, updateCode] = useTextfield('');
  const largeScreen = useMediaQuery((theme) => theme.breakpoints.up('md'));
  const navigate = useNavigate();

  const sendChangeSettings = useCallback(
    (settings) => {
      if (onSettingsChange) {
        onSettingsChange({
          time_limit: settings.updatedTime || time,
          total_musics: parseInt(settings.updatedMovieNumber || movieNumber),
          difficulty: settings.updatedDifficulty || difficulty,
          categories: settings.categories || selectedCategories,
        });
      }
    },
    [selectedCategories, difficulty, movieNumber, onSettingsChange, time]
  );

  useEffect(() => {
    if (!categories.length) {
      getCategories();
    }
  }, [categories, getCategories]);

  useEffect(() => {
    sendChangeSettings({ selectedCategories });
  }, [selectedCategories, sendChangeSettings]);

  const handleClickSettings = async function (event) {
    event.preventDefault();

    setErrorCode(null);

    if (code && code !== '' && redirect) {
      const game = await getGame(code);
      if (!game._id) {
        return setErrorCode("La partie correspondante à ce code n'existe pas");
      }
      return navigate(`/${redirect}?code=${code}`);
    }

    onSettingsSaved({
      time,
      movieNumber,
      difficulty,
      categories: selectedCategories,
    });
  };

  const handleClickResetCode = function () {
    updateCode('');
  };

  const onTimeChange = useCallback(
    (event, value) => {
      updateTime(event, value);
      sendChangeSettings({ updatedTime: value });
    },
    [updateTime, sendChangeSettings]
  );

  const onMovieNumberChange = useCallback(
    (event) => {
      updateMovieNumber(event);
      sendChangeSettings({ updatedMovieNumber: event.target.value });
    },
    [updateMovieNumber, sendChangeSettings]
  );

  const onDifficultyChange = useCallback(
    (event) => {
      updateDifficulty(event);
      sendChangeSettings({ updatedDifficulty: event.target.value });
    },
    [updateDifficulty, sendChangeSettings]
  );

  const onCategoriesChange = useCallback(
    (event, category) => {
      const isChecked = event.target.checked;
      updateSelectedCategories({
        ...selectedCategories,
        [category._id]: isChecked,
      });
    },
    [updateSelectedCategories, selectedCategories]
  );

  if (!categories) {
    return <Loading />;
  }

  return (
    <PaperBox>
      <Box
        sx={{ width: '100%' }}
        component="form"
        onSubmit={handleClickSettings}
      >
        <Grid
          container
          spacing={3}
        >
          {!noGameCode && (
            <Grid
              item
              xs={12}
            >
              {errorCode && (
                <Alert
                  severity="error"
                  sx={{ marginBottom: '24px' }}
                >
                  <AlertTitle>Erreur</AlertTitle>
                  {errorCode}
                </Alert>
              )}
              <FormControl>
                <TextField
                  label="Code de la partie"
                  value={code}
                  onChange={updateCode}
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
              <div style={{ marginTop: '16px' }}>
                <Button
                  variant="contained"
                  onClick={handleClickSettings}
                  type="submit"
                  size="large"
                  disabled={!code}
                >
                  Lancer la partie
                </Button>
              </div>
              <Divider
                textAlign={largeScreen ? 'left' : 'center'}
                sx={{ marginTop: '24px' }}
              >
                Ou Créez votre partie sur mesure
              </Divider>
            </Grid>
          )}
          <Grid
            item
            xs={12}
          >
            <Typography gutterBottom>
              Durée de chaques manches:{' '}
              {(room.settings && room.settings.time_limit) || time} secondes
            </Typography>
            <Slider
              aria-label="Durée des manches"
              value={(room.settings && room.settings.time_limit) || time}
              getAriaValueText={valuetext}
              valueLabelDisplay="auto"
              step={5}
              marks
              min={5}
              max={180}
              onChange={onTimeChange}
            />
          </Grid>

          <Grid
            item
            xs={12}
          >
            <FormControl required>
              <Typography gutterBottom>Thème</Typography>
              <Typography variant="subtitle2">
                Choisissez au moins 1 thème
              </Typography>
              <FormGroup row>
                {categories.map((category) => (
                  <FormControlLabel
                    key={category._id}
                    control={<Checkbox />}
                    label={category.label_fr}
                    onChange={(event) => onCategoriesChange(event, category)}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <Typography gutterBottom>Nombre de musiques</Typography>
            <TextField
              type="number"
              defaultValue={
                (room.settings && room.settings.total_musics) || movieNumber
              }
              InputProps={{
                inputProps: {
                  min: MOVIE_MIN,
                  max: MOVIE_MAX,
                },
              }}
              onChange={onMovieNumberChange}
            />
          </Grid>

          <Grid
            item
            xs={12}
          >
            <FormControl>
              <Typography gutterBottom>Difficulté de la partie</Typography>
              <RadioGroup
                defaultValue={
                  (room.settings && room.settings.difficulty) || difficulty
                }
                value={difficulty}
                onChange={onDifficultyChange}
              >
                <FormControlLabel
                  value="easy"
                  control={<Radio />}
                  label="Facile (réponse parmis plusieurs)"
                />
                <FormControlLabel
                  value="difficult"
                  control={<Radio />}
                  label="Difficile (tapez la bonne réponse)"
                />
              </RadioGroup>
            </FormControl>
          </Grid>

          <Grid
            item
            xs={12}
          >
            <Button
              variant="contained"
              onClick={handleClickSettings}
              type="submit"
              disabled={
                !Object.keys(selectedCategories).filter(
                  (c) => selectedCategories[c]
                ).length
              }
            >
              Lancer la partie
            </Button>
          </Grid>
        </Grid>
      </Box>
    </PaperBox>
  );
}

GameSettings.propTypes = {
  noGameCode: PropTypes.bool,
  onSettingsSaved: PropTypes.func.isRequired,
  onSettingsChange: PropTypes.func,
  redirect: PropTypes.string,
  room: PropTypes.object,
};

GameSettings.defaultProps = {
  noGameCode: false,
  onSettingsChange: null,
  redirect: null,
  room: {},
};

export default GameSettings;
