import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Container } from '@mui/material/';
import { getCookie } from 'react-use-cookie';
import { SocketContext, socket } from '../contexts/sockets';
import { usersActions } from '../actions';
import { Header } from '../components/Header';
import { Loading } from '../components/UI';
import { UserContext } from '../contexts/userContext';

import '../assets/App.scss';

function App(props) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCookie('user');

    if (!userId || userId === '') {
      navigate('/login');
    } else {
      (async function () {
        if (!props.users.me.username || !user._id) {
          const userLoaded = await props.usersActions.getUserById(userId);
          setUser(userLoaded);
        }
      })();
    }
  }, [navigate, props.users.me.username, props.usersActions, user]);

  const updateUser = function (user) {
    setUser(user);
  };

  if (!user._id) {
    return <Loading />
  }

  return (
    <SocketContext.Provider value={socket}>
      <UserContext.Provider value={{ user, updateUser }} >
        <Header user={user} />
        <Container maxWidth="xl" className="Page">
          <Outlet />
        </Container>
      </ UserContext.Provider>
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
