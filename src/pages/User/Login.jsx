import { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import useCookie from 'react-use-cookie';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  IconButton,
  InputAdornment,
  Fade,
  Alert,
  AlertTitle,
  Link,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { musicsActions, usersActions } from '../../actions';
import { useTextfield, useToggle } from '../../hooks/formHooks';
import { updateTitle } from '../../lib/document';
import { Copyright } from '../../components/Footer';
import { Heading } from '../../components/UI';

function Login(props) {
  const [, setUserToken] = useCookie('user', {});
  const [showPassword, updateShowPassword] = useToggle();
  const [email, updateEmail] = useTextfield();
  const [password, updatePassword] = useTextfield();
  const [serverErrors, setServerErrors] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    updateTitle('Se connecter');
  }, []);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setServerErrors(null);

    const user = await props.usersActions.login(email, password);

    if (user.error && user.error === 'notConfirmed') {
      return navigate('/confirm');
    } else if (user.error) {
      return setServerErrors(user.error);
    }

    if (user.username) {
      const isDev =
        !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

      setUserToken(user._id, {
        days: 365,
        SameSite: 'Strict',
        Secure: !isDev,
        domain: isDev ? '' : '.blindtus.com',
      });

      navigate('/');
    }
  };

  return (
    <Box
      sx={{
        my: 8,
        mx: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        <LockOutlinedIcon />
      </Avatar>
      <Heading>Se connecter</Heading>
      <Typography marginY={2}>
        Seule la{' '}
        <b>
          <RouterLink
            to="/today"
            style={{ color: 'inherit' }}
          >
            partie du jour
          </RouterLink>
        </b>{' '}
        est disponnible sans avoir de compte.
      </Typography>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
      >
        {renderError()}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          type="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          onChange={updateEmail}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="current-password"
          onChange={updatePassword}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={updateShowPassword}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Se connecter
        </Button>
        <Grid container>
          <Grid
            item
            xs
          >
            <Link
              component={RouterLink}
              to="/ask-new-password"
              color="inherit"
            >
              Mot de passe perdu ?
            </Link>
          </Grid>
          <Grid item>
            <Link
              component={RouterLink}
              to="/signup"
              color="inherit"
            >
              Créez en un compte
            </Link>
          </Grid>
        </Grid>
        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Box>
  );

  function renderError() {
    if (!serverErrors) {
      return;
    }

    return (
      <Fade
        in
        timeout={{ enter: 500 }}
      >
        <Alert
          severity="error"
          sx={{ marginBottom: '24px' }}
        >
          <AlertTitle>Error</AlertTitle>
          {serverErrors}
        </Alert>
      </Fade>
    );
  }
}

function mapStateToProps(state) {
  return {
    musics: state.musics,
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    musicsActions: bindActionCreators(musicsActions, dispatch),
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
