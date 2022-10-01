import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material/';
import { getCookie } from 'react-use-cookie';
import { SocketContext, socket } from '../context/socket';
import { usersActions } from '../actions';
import { Header } from '../components/Header';

function App(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCookie('user');

    if (!userId || userId === '') {
      navigate('/login');
    } else {
      (async function () {
        if (!props.users.me.username) {
          await props.usersActions.getUserById(userId);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  return (
    <SocketContext.Provider value={socket}>
      <Header />
      <Container maxWidth="xl" className="Page">
        <Outlet />
      </Container>
    </SocketContext.Provider>
  );
}

function mapStateToProps(state) {
  return {
    users: state.users,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
