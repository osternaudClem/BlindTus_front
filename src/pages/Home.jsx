import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
} from '@mui/material';
import { CircleButton } from '../components/Buttons';

function Home() {
  const navigate = useNavigate();

  const handleClickNewGame = function() {
    navigate('/new-game');
  }

  return (
    <div>
      <CssBaseline />
      <CircleButton onClick={handleClickNewGame} />
    </div>
  )
}

export default Home;