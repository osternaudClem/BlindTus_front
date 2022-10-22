import React from 'react';
import PropTypes from 'prop-types';
import { IconButton } from '@mui/material/';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

function CircleButton({ className, onClick }) {
  return (
    <IconButton size="large" onClick={onClick} className={className}>
      <PlayCircleIcon sx={{ fontSize: 220 }} color="primary" />
    </IconButton>
  )
}

CircleButton.propTypes = {
  className: PropTypes.string,
  onClick: PropTypes.func,
};

CircleButton.defaultProps = {
  className: null,
  onClick: () => {},
};

export default CircleButton;