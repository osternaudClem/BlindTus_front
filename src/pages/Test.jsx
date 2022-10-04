import React, { useState } from 'react';

import {
  CssBaseline,
  Typography,
  Box,
} from '@mui/material';
import ReactPlayer from 'react-player';

function Test() {
  const [playing, setPlaying] = useState(false);

  const handleClick = function() {
    setPlaying(true);
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <CssBaseline />
      <button onClick={handleClick}>Play</button>
      <ReactPlayer
        playing={playing}
        // playsinline={true}
        loop={true}
        url="https://www.youtube.com/embed/NBE-uBgtINg"
      />
      {/* <iframe
        width="400"
        height="300"
        src="https://www.youtube.com/embed/PqHPU1TXfEk"
        title="YouTube video player"
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media;"
        >
        </iframe> */}
    </Box>
  )
}

export default Test;