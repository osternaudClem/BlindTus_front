import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import { CircleButton } from '../components/Buttons';
import { updateTitle } from '../lib/document';

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    updateTitle('Accueil');
  }, []);

  const handleClickNewGame = function () {
    navigate('/new-game');
  };

  return (
    <div className="HomePage">
      <CssBaseline />
      <CircleButton
        onClick={handleClickNewGame}
        className="HomePage__button"
      />
    </div>
  );
}

export default Home;
