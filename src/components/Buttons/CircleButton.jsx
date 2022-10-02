import React from 'react';
import { IconButton } from '@mui/material/';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

function CircleButton({ onClick }) {
  return (
    <IconButton aria-label="play" size="large" onClick={onClick}>
      <PlayCircleOutlineIcon sx={{ fontSize: 200 }} color="primary" />
    </IconButton>
  )
}

export default CircleButton;