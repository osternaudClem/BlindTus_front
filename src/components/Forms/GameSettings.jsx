import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
  Checkbox,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  MenuItem,
  ListItemText,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import useMediaQuery from '@mui/material/useMediaQuery';

import { useSlider, useTextfield } from '../../hooks/formHooks';
import { gamesActions, categoriesActions } from '../../actions';
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
  ...props
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

  const [selectedCategories, setSelectedCategories] = useState([]);
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
    if (!props.categories.length) {
      props.categoriesActions.getCategories();
    }
  }, [props.categories, props.categoriesActions]);

  useEffect(() => {
    sendChangeSettings({ selectedCategories });
  }, [selectedCategories, sendChangeSettings]);

  const handleClickSettings = async function (event) {
    event.preventDefault();

    setErrorCode(null);

    if (code && code !== '' && redirect) {
      const game = await props.gamesActions.getGame(code);
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

  const onUpdateCategories = (event) => {
    setSelectedCategories(
      // On autofill we get a stringified value.
      typeof value === 'string'
        ? event.target.value.split(',')
        : event.target.value
    );
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

  if (!props.categories) {
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
              max={60}
              onChange={onTimeChange}
            />
          </Grid>

          <Grid
            item
            xs={12}
          >
            <FormControl required>
              <Typography gutterBottom>Thèmes</Typography>
              <Typography variant="subtitle2">
                Choisissez au moins 1 thème
              </Typography>
              <FormControl sx={{ mt: 1, width: 300 }}>
                <InputLabel id="select-categories-label">Thèmes</InputLabel>

                <Select
                  labelId="select-categories-label"
                  id="select-categories"
                  multiple
                  value={selectedCategories}
                  onChange={onUpdateCategories}
                  input={
                    <OutlinedInput
                      id="select-multiple-categories"
                      label="Thèmes"
                    />
                  }
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={
                            props.categories.find((c) => c._id === value).label
                          }
                        />
                      ))}
                    </Box>
                  )}
                  // MenuProps={MenuProps}
                >
                  {props.categories
                    .filter((c) => c.isDisplayInGame)
                    .map((category) => {
                      return (
                        <MenuItem
                          key={category._id}
                          value={category._id}
                        >
                          <Checkbox
                            checked={
                              selectedCategories.indexOf(category._id) > -1
                            }
                          />
                          <ListItemText primary={category.label} />
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
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
              disabled={!selectedCategories.length}
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

function mapStateToProps(state) {
  return {
    categories: state.categories.all,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gamesActions: bindActionCreators(gamesActions, dispatch),
    categoriesActions: bindActionCreators(categoriesActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GameSettings);
