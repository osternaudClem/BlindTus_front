import React, { useRef, useState } from 'react';
import { connect } from 'react-redux';

import {
  CssBaseline,
  Box,
  Container,
  Typography,
} from '@mui/material';

import { GamePlayer } from '../components/Game';

function Test() {
  const audioRef = useRef();
  const buttonRef = useRef();
  const [pist, setPist] = useState(0);
  const audio = [
    'hans-zimmer-now-we-are-free-nbe-ubgting',
    'keane-somewhere-only-we-know-oextk-if8hq',
    'the-nuns-choir-from-st-catherines-convent-san-fransisco-i-will-follow-him-vppd-6x3teo',
  ];

  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3">Test</Typography>

        <Box sx={{ '& button': { m: 1 } }}>
            <GamePlayer
              audioName={audio[0]}
            />
        </Box>
      </Container>
    </Box>
  )
}

function mapStateToProps(state) {
  return {
  };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);