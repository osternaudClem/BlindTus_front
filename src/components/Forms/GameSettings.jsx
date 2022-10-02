import React from 'react';
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
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';

import { useSlider, useTextfield } from '../../hooks/formHooks';

const MOVIE_MIN = 5;
const MOVIE_MAX = 100;

function valuetext(value) {
  return `${value} secondes`;
}

function GameSettings({ onSettingsSaved }) {
  const [time, updateTime] = useSlider(30);
  const [movieNumber, updateMovieNumber] = useTextfield(5);
  const [difficulty, updateDifficulty] = useTextfield('easy');
  const [code, updateCode] = useTextfield('');
  const navigate = useNavigate();

  const handleClickSettings = function (event) {
    event.preventDefault();

    if (code && code !== '') {
      return navigate(`/new-game?code=${code}`);
    }

    onSettingsSaved({ time, movieNumber, difficulty });
  }

  const handleClickResetCode = function () {
    updateCode('');
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
        <Divider textAlign="left" sx={{ marginBottom: '24px' }}>Ou Créez votre partie sur mesure</Divider>
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
            onChange={updateTime}
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
            onChange={updateMovieNumber}
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
              onChange={updateDifficulty}
            >
              <FormControlLabel value="easy" control={<Radio />} label="Facile" />
              <FormControlLabel value="difficult" control={<Radio />} label="Difficile" />
            </RadioGroup>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleClickSettings}>Lancer la partie</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

export default GameSettings;