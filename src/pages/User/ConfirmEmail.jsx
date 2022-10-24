import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import useCookie from 'react-use-cookie';
import {
  Avatar,
  Box,
  Typography,
  Fade,
  Alert,
  AlertTitle,
} from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import ReplayIcon from '@mui/icons-material/Replay';
import { usersActions } from '../../actions';
import { updateTitle } from '../../lib/document';
import '../Page.scss';
import { Heading } from '../../components/UI';

function ConmfirmEmail(props) {
  const [, setUserToken] = useCookie('user', {});
  const [call, setCall] = useState(0);
  const [error, setError] = useState(null);
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('token');
  const navigate = useNavigate();

  useEffect(() => {
    updateTitle('Confirmez votre e-mail');
  }, []);

  useEffect(() => {
    if (token && call === 0) {
      (async function () {
        const request = await props.usersActions.confirm(token);
        if (request.error) {
          setError(request.messages);
        } else {
          const isDev =
            !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
          setUserToken(request._id, {
            days: 365,
            SameSite: 'Strict',
            Secure: true,
            domain: isDev ? '' : '.cl3tus.com',
          });
          navigate('/');
        }
        setCall(1);
      })();
    }
  });

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
      className="ConfirmEmail"
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <EmailOutlinedIcon />
      </Avatar>
      <Heading>Validez votre e-mail</Heading>
      {renderError()}
      <Typography
        component="p"
        variant="body1"
        className="ConfirmEmail__content"
      >
        Un e-mail vient de vous etres envoyé ! Nous vous avons envoyez un lien
        pour confirmer votre compte a l'adresse: <b>{props.users.me.email}</b>
      </Typography>

      <Typography
        component="p"
        variant="body2"
        className="ConfirmEmail__subcontent"
      >
        Vous n'avez pas reçu un e-mail de confirmation ? Vérifiez vos SPAM ou{' '}
        <ReplayIcon className="ConfirmEmail__texticon" /> Envoyer de nouveau.
      </Typography>
    </Box>
  );

  function renderError() {
    if (!error) {
      return;
    }

    return (
      <Fade
        in
        timeout={{ enter: 500 }}
      >
        <Alert
          severity="error"
          sx={{ marginTop: '24px', width: '100%' }}
        >
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      </Fade>
    );
  }
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

export default connect(mapStateToProps, mapDispatchToProps)(ConmfirmEmail);
