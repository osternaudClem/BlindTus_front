import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CssBaseline,
} from '@mui/material';
import { CircleButton } from '../components/Buttons';
import cinema from '../assets/images/cinema.png';

function Home() {
  const navigate = useNavigate();

  const handleClickNewGame = function () {
    navigate('/new-game');
  }

  return (
    <div className="HomePage">
      <CssBaseline />
      <img src={cinema} className="HomePage__illustration" />
      <CircleButton onClick={handleClickNewGame} className="HomePage__button" />
    </div>
  )
}

export default Home;