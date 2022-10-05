import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { useCountdown } from 'usehooks-ts';
import {
  CssBaseline,
  Box,
  Container,
  Typography,
} from '@mui/material';

import { musicsActions } from '../actions';

import { Result } from '../components/Results';

function Test(props) {
  const [intervalValue, setIntervalValue] = useState(1000);

  const [count, { startCountdown, stopCountdown, resetCountdown }] =
    useCountdown({
      countStart: 3,
      intervalMs: intervalValue,
    })

  const handleChangeIntervalValue = (event) => {
    setIntervalValue(Number(event.target.value))
  }

  return (
    <Box>
      <CssBaseline />
      <Typography variant="h3">Test</Typography>
      <p>Count: {count}</p>

      <input
        type="number"
        value={intervalValue}
        onChange={handleChangeIntervalValue}
      />
      <button onClick={startCountdown}>start</button>
      <button onClick={stopCountdown}>stop</button>
      <button onClick={resetCountdown}>reset</button>
    </Box>
  )
}

function mapStateToProps(state) {
  return {
    musics: state.musics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    musicsActions: bindActionCreators(musicsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);