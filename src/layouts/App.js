import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Outlet } from 'react-router-dom';
import { Container } from '@mui/material/';
import { getCookie } from 'react-use-cookie';
import { SocketContext, socket } from '../context/socket';
import { usersActions } from '../actions';
import { Header } from '../components/Header';
import { UserContext } from '../contexts/userContext';

function App(props) {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const userId = getCookie('user');

    if (!userId || userId === '') {
      navigate('/login');
    } else {
      (async function () {
        if (!props.users.me.username) {
          const userLoaded = await props.usersActions.getUserById(userId);
          setUser(userLoaded)
        }
      })();
    }
  }, [navigate, props.users.me.username, props.usersActions]);

  const updateUser = function (user) {
    setUser(user);
  };

  if (!props.users.me._id) {
    return <div>Loading ...</div>
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
