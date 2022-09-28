import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmail, isStrongPassword } from 'validator';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Grid,
  Typography,
  FormHelperText,
  IconButton,
  InputAdornment,
  Alert,
  AlertTitle,
  Fade,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { musicsActions, usersActions } from '../actions';
import { useTextfield, useToggle } from '../hooks/formHooks';
import { Copyright } from '../components/Footer';
import './Page.scss';


function Signup(props) {
  // eslint-disable-next-line
  const [username, updateUsername] = useTextfield('');
  const [email, updateEmail] = useTextfield('');
  const [password, updatePassword] = useTextfield();
  const [showPassword, updateShowPassword] = useToggle();
  const [confirmPassowrd, updateConfirmPassword] = useTextfield();
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async function (event) {
    event.preventDefault();
    setServerErrors(null);
    // Check username
    const usernameError = username === '' || !/^[a-zA-Z0-9\-_$@*!]{3,30}$/.test(username);
    // Check email
    const emailError = email === '' || !isEmail(email);
    // Check password
    const passwordError = password === '' || !isStrongPassword(password, {
      minSymbols: 0,
    });
    // Check confirm password
    const confirmPasswordError = password !== confirmPassowrd;

    setErrors(errors => {
      return {
        ...errors,
        username: usernameError,
        email: emailError,
        password: passwordError,
        confirmPassowrd: confirmPasswordError,
      }
    });

    if (usernameError || emailError || passwordError || confirmPasswordError) {
      return;
    }

    const response = await props.usersActions.signup({ username, email, password });

    if (response.error) {
      return setServerErrors(response.messages);
    }

    navigate('/confirm');

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
      <Typography component="h1" variant="h5">
        Créer un compte
      </Typography>
      <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {renderError()}
        <TextField
          margin="none"
          required
          fullWidth
          label="Nom d'utilisateur"
          autoComplete="username"
          autoFocus
          onChange={updateUsername}
          error={errors && errors.username}
        />
        <FormHelperText>
          Le nom d'utilisateur ne doit pas contenir d'espace et être unique.
        </FormHelperText>

        <TextField
          margin="normal"
          required
          fullWidth
          label="Adresse E-mail"
          autoComplete="email"
          onChange={updateEmail}
          error={errors && errors.email}
        />

        <TextField
          margin="normal"
          required
          fullWidth
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          onChange={updatePassword}
          error={errors && errors.password}
          InputProps={{
            endAdornment:
              <InputAdornment position="end" >
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={updateShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
          }}
        />
        <FormHelperText>
          Le mot de passe doit faire au minimum 8 charactères et contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.
        </FormHelperText>

        <TextField
          margin="normal"
          required
          fullWidth
          label="Confirmer le mot de passe"
          type="password"
          onChange={updateConfirmPassword}
          error={errors && errors.confirmPassowrd}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Créer mon compte
        </Button>
        <Grid container>
          <Grid item xs>

          </Grid>
          <Grid item>
            <div onClick={() => navigate('/login')} variant="body2">
              {"Déja un compte? Connecte-toi"}
            </div>
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
      <Fade in timeout={{ enter: 500 }}>
        <Alert severity="error" sx={{ marginBottom: '24px' }}>
          <AlertTitle>Error</AlertTitle>
          {serverErrors}
        </Alert>
      </Fade>
    )
  }
}

function mapStateToProps(state) {
  return {
    musics: state.musics,
    users: state.users,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    musicsActions: bindActionCreators(musicsActions, dispatch),
    usersActions: bindActionCreators(usersActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Signup)