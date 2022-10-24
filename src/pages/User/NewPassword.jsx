import React, { useState, useEffect } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isStrongPassword } from 'validator';
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
  Link,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { usersActions } from '../../actions';
import { useTextfield, useToggle } from '../../hooks/formHooks';
import { updateTitle } from '../../lib/document';
import { Copyright } from '../../components/Footer';
import '../Page.scss';
import { Heading } from '../../components/UI';

function NewPassword(props) {
  // eslint-disable-next-line
  const [password, updatePassword] = useTextfield();
  const [showPassword, updateShowPassword] = useToggle(false);
  const [confirmPassowrd, updateConfirmPassword] = useTextfield();
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);
  const navigate = useNavigate();
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const token = urlParams.get('token');

  useEffect(() => {
    updateTitle('Nouveau mot de passe');
  }, []);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setServerErrors(null);
    // Check password
    const passwordError =
      password === '' ||
      !isStrongPassword(password, {
        minSymbols: 0,
      });
    // Check confirm password
    const confirmPasswordError = password !== confirmPassowrd;

    setErrors((errors) => {
      return {
        ...errors,
        password: passwordError,
        confirmPassowrd: confirmPasswordError,
      };
    });

    if (passwordError || confirmPasswordError) {
      return;
    }

    const response = await props.usersActions.saveNewPassword(token, password);

    if (response.error) {
      return setServerErrors(response.messages);
    }

    navigate('/login');
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
      <Heading>Nouveau mot de passe</Heading>
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{ mt: 1 }}
      >
        {renderError()}
        <TextField
          margin="normal"
          required
          fullWidth
          name="other"
          label="Mot de passe"
          type={showPassword ? 'text' : 'password'}
          onChange={updatePassword}
          error={errors && errors.password}
          inputProps={{
            autoComplete: 'off',
          }}
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
        <FormHelperText>
          Le mot de passe doit faire au minimum 8 charactères et contenir au
          moins 1 majuscule, 1 minuscule et 1 chiffre.
        </FormHelperText>

        <TextField
          margin="normal"
          required
          fullWidth
          label="Confirmer le mot de passe"
          type="password"
          onChange={updateConfirmPassword}
          error={errors && errors.confirmPassowrd}
          inputProps={{ autoComplete: 'off' }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Créer un nouveau mot de passe
        </Button>
        <Grid container>
          <Grid
            item
            xs
          ></Grid>
          <Grid item>
            <Link
              component={RouterLink}
              to="/login"
              color="inherit"
            >
              Déja un compte ? Connecte-toi
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
    users: state.users,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewPassword);
