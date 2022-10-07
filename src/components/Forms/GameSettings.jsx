import { useState } from 'react';
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
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { useSlider, useTextfield } from '../../hooks/formHooks';
import { gamesActions } from '../../actions';

const MOVIE_MIN = 5;
const MOVIE_MAX = 100;

function valuetext(value) {
  return `${value} secondes`;
}

function GameSettings({ onSettingsSaved, onSettingsChange, redirect, noGameCode, ...props }) {
  const [errorCode, setErrorCode] = useState(null);
  const [time, updateTime] = useSlider(30);
  const [movieNumber, updateMovieNumber] = useTextfield(5);
  const [difficulty, updateDifficulty] = useTextfield('easy');
  const [code, updateCode] = useTextfield('');
  const navigate = useNavigate();

  const handleClickSettings = async function (event) {
    event.preventDefault();

    setErrorCode(null);

    if (code && code !== '' && redirect) {
      const game = await props.gamesActions.getGame(code);
      if (!game.id_) {
        return setErrorCode('La partie correspondante à ce code n\'existe pas');
      }
      return navigate(`/${redirect}?code=${code}`);
    }

    onSettingsSaved({ time, movieNumber, difficulty });
  }

  const handleClickResetCode = function () {
    updateCode('');
  }

  const onTimeChange = function (event, value) {
    updateTime(event, value);
    sendChangeSettings({ updatedTime: value });
  }

  const onMovieNumberChange = function (event) {
    updateMovieNumber(event);
    sendChangeSettings({ updatedMovieNumber: event.target.value });
  }

  const onDifficultyChange = function (event) {
    updateDifficulty(event);
    sendChangeSettings({ updatedDifficulty: event.target.value });
  }

  const sendChangeSettings = function (settings) {
    if (onSettingsChange) {
      onSettingsChange({
        timeLimit: settings.updatedTime || time,
        totalMusics: settings.updatedMovieNumber || movieNumber,
        difficulty: settings.updatedDifficulty || difficulty,
      });
    }
  }

  return (
    <Box sx={{ width: '100%' }} component="form" onSubmit={handleClickSettings}>
      <Grid container spacing={3}>
        {!noGameCode &&
          <Grid item xs={12}>
            {errorCode && (
              <Alert severity="error" sx={{ marginBottom: '24px' }}>
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
                  endAdornment:
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="erase text field"
                        onClick={handleClickResetCode}
                        edge="end"
                      >
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                }}
              />
            </FormControl>
            <div style={{ marginTop: '16px' }}>
              <Button variant="contained" onClick={handleClickSettings} type="submit" size="large">Lancer la partie</Button>
            </div>
            <Divider textAlign="left" sx={{ marginTop: '24px' }}>Ou Créez votre partie sur mesure</Divider>
          </Grid>
        }
        <Grid item xs={12}>
          <Typography gutterBottom>
            Durée de chaques manches: {time} secondes
          </Typography>
          <Slider
            aria-label="Durée des manches"
            defaultValue={30}
            getAriaValueText={valuetext}
            valueLabelDisplay="auto"
            step={5}
            marks
            min={5}
            max={180}
            onChange={onTimeChange}
          />
        </Grid>
        <Grid item xs={12}>
          <Typography gutterBottom>
            Nombre de films
          </Typography>
          <TextField
            type="number"
            defaultValue={movieNumber}
            InputProps={{
              inputProps: {
                min: MOVIE_MIN,
                max: MOVIE_MAX,
              }
            }}
            onChange={onMovieNumberChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl>
            <Typography gutterBottom>
              Difficulté de la partie
            </Typography>
            <RadioGroup
              row
              aria-labelledby="choix-de-la-difficulte"
              name="row-radio-buttons-group"
              defaultValue={difficulty}
              value={difficulty}
              onChange={onDifficultyChange}
            >
              <FormControlLabel value="easy" control={<Radio />} label="Facile" />
              <FormControlLabel value="difficult" control={<Radio />} label="Difficile" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleClickSettings} type="submit">Lancer la partie</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

GameSettings.propTypes = {
  noGameCode: PropTypes.bool,
  onSettingsSaved: PropTypes.func.isRequired,
  onSettingsChange: PropTypes.func,
  redirect: PropTypes.string,
};

GameSettings.defaultProps = {
  noGameCode: false,
  onSettingsChange: null,
  redirect: null,
};

function mapDispatchToProps(dispatch) {
  return {
    gamesActions: bindActionCreators(gamesActions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(GameSettings);