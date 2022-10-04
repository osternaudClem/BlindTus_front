import React from 'react';

import {
  CssBaseline,
  Typography,
  Box,
} from '@mui/material';
import ReactPlayer from 'react-player';

function Test() {
 
  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <CssBaseline />
      <ReactPlayer
       playing={true}
       playsinline={true}
       loop={true}
       url="https://youtu.be/1Vko01D77Fg?t=3"
       />
    </Box>
  )
}

export default Test;