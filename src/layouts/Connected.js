import React, { useContext, useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '@mui/material/';
import { UserContext } from '../contexts/userContext';
import { SocketContext, socket } from '../contexts/sockets';
import { usersActions } from '../actions';

import '../assets/App.scss';

function App() {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user._id) {
      navigate('/login');
    }
  }, [navigate, user]);

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

function mapStateToProps(state) {
  return {
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
