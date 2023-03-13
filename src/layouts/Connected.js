import React, { useContext, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { Container } from '@mui/material/';
import { UserContext } from '../contexts/userContext';
import { SocketContext, socket } from '../contexts/sockets';

import '../assets/App.scss';

function App() {
  const navigate = useNavigate();
  const { isLogged } = useContext(UserContext);

  useEffect(() => {
    if (!isLogged) {
      navigate('/login');
    }
  }, [navigate, isLogged]);

  return (
    <SocketContext.Provider value={socket}>
      <Container
        maxWidth="xl"
        className="Page"
      >
        <Outlet />
      </Container>
    </SocketContext.Provider>
  );
}

export default App;
