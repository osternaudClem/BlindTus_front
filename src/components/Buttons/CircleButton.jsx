import React from 'react';
import { IconButton } from '@mui/material/';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

function CircleButton({ className, onClick }) {
  return (
    <IconButton size="large" onClick={onClick} className={className}>
      <PlayCircleIcon sx={{ fontSize: 220 }} color="primary" />
    </IconButton>
  )
}

export default CircleButton;