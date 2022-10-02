import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isStrongPassword } from 'validator';
import {
  Typography,
  Paper,
  TextField,
  Stack,
  Divider,
  Button,
  Alert,
  AlertTitle,
  Snackbar,
  Slide,
  FormHelperText,
  FormControl,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { usersActions } from '../../actions';
import { useTextfield, useToggle } from '../../hooks/formHooks';
import { UserContext } from '../../contexts/userContext';

function SlideTransition(props) {
  return <Slide {...props} direction="down" />;
}

function ChangePasswordSettings(props) {
  const { user } = useContext(UserContext);
  const [currentPassword, updateCurrentPassword] = useTextfield();
  const [newPassword, updateNewPassword] = useTextfield();
  const [confirmNewPassword, updateConfirmNewPassword] = useTextfield();
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);
  const [snackOpen, toggleSnack] = useToggle(false);
  const [showPassword, toggleShowPassword] = useToggle(false);
  const [showNewPassword, toggleShowNewPassword] = useToggle(false);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setServerErrors(null);

    // Check password
    const passwordError = newPassword === '' || !isStrongPassword(newPassword, {
      minSymbols: 0,
    });
    // Check confirm password
    const confirmPasswordError = newPassword !== confirmNewPassword;

    setErrors(errors => {
      return {
        ...errors,
        newPassword: passwordError,
        confirmNewPassword: confirmPasswordError,
      }
    });

    if (passwordError || confirmPasswordError) {
      return;
    }

    const response = await props.usersActions.changePassword(user._id, { password: currentPassword, newPassword });
    console.log('>>> response', response.messages);
    if (response.error) {
      return setServerErrors(response.messages);
    }

    updateCurrentPassword('');
    updateNewPassword('');
    updateConfirmNewPassword('');

    toggleSnack(true);
  };

  return (
    <React.Fragment>
      <Snackbar
        open={snackOpen}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        TransitionComponent={SlideTransition}
        onClose={toggleSnack}
      >
        <Alert
          variant="filled"
          elevation={6}
          onClose={toggleSnack}
          severity="success"
          sx={{ width: '100%' }}
        >
          Mot de passe changé
        </Alert>
      </Snackbar>

      <Typography variant="h3" component="h2" mb={2}>Modifier votre mot de passe</Typography>
      <Paper sx={{ padding: '2rem' }} component="form" onSubmit={handleSubmit}>
        <Stack
          spacing={4}
          sx={{ marginBottom: '1rem' }}
        >
          {renderError()}
          <TextField
            label="Mot de passe actuel"
            type={showPassword ? 'text' : 'password'}
            value={currentPassword}
            fullWidth
            onChange={updateCurrentPassword}
            error={errors && errors.currentPassword}
            InputProps={{
              endAdornment:
                <InputAdornment position="end" >
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
            }}
          />

          <FormControl>
            <TextField
              label="Nouveau mot de passe"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              fullWidth
              onChange={updateNewPassword}
              error={errors && errors.newPassword}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end" >
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={toggleShowNewPassword}
                      edge="end"
                    >
                      {showNewPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
              }}
            />
            <FormHelperText>
              Le mot de passe doit faire au minimum 8 charactères et contenir au moins 1 majuscule, 1 minuscule et 1 chiffre.
            </FormHelperText>
          </FormControl>

          <TextField
            label="Confirmez votre nouveau mot de passe"
            type="password"
            value={confirmNewPassword}
            fullWidth
            onChange={updateConfirmNewPassword}
            error={errors && errors.confirmNewPassword}
          />
          <Divider />
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={{ xs: 2 }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            type="submit"
          >
            Modifier
          </Button>
        </Stack>
      </Paper >
    </React.Fragment >
  );

  function renderError() {
    console.log('>>> serverErrors', serverErrors)
    if (!serverErrors) {
      return;
    }

    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {serverErrors}
      </Alert>
    )
  }
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  }
}

export default connect(null, mapDispatchToProps)(ChangePasswordSettings);