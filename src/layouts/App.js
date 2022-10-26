import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, CssBaseline } from '@mui/material/';
import { getCookie } from 'react-use-cookie';
import CookieConsent from 'react-cookie-consent';
import { usersActions } from '../actions';
import { Header, HeaderNotLogged } from '../components/Header';
import { Loading } from '../components/UI';
import { UserContext } from '../contexts/userContext';

import '../assets/App.scss';

function App(props) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const userId = getCookie('user');

  useEffect(() => {
    if (userId && userId !== '') {
      (async function () {
        if (!props.users.me.username || !user._id) {
          const userLoaded = await props.usersActions.getUserById(userId);
          setUser(userLoaded);
          setIsLoading(false);
        }
      })();
    } else {
      setIsLoading(false);
    }
  }, [navigate, props.users.me.username, props.usersActions, user, userId]);

  const updateUser = function (user) {
    setUser(user);
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      <CssBaseline />
      <CookieConsent
        location="bottom"
        buttonText="Accepter"
        cookieName="acceptCookie"
        overlay
        overlayClasses="CookieConsent__overlay"
        ButtonComponent={Button}
        customButtonProps={{
          variant: 'contained',
          style: { marginRight: '10px' },
        }}
        style={{ background: '#2B373B' }}
        expires={5}
      >
        Ce site utilise des cookies. <br />
        Il en utilise exactement 4 : pour garder la session active, pour
        enregistrer les progrès et enregistrer les statistiques de la "partie du
        jour" si vous n'avez pas de compte, et un dernier pour Google Analytics.
        <br />
        Vous pouvez retrouver ces informations sur la page{' '}
        <Link
          to="/privacy"
          style={{ color: 'inherit' }}
        >
          confidentialité
        </Link>
        .
      </CookieConsent>
      {userId ? <Header user={user} /> : <HeaderNotLogged />}
      <Outlet />
    </UserContext.Provider>
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
