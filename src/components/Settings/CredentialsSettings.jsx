import React, { useContext, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
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
} from '@mui/material';
import { isEmail } from 'validator';

import { usersActions } from '../../actions';
import { useTextfield, useToggle } from '../../hooks/formHooks';
import { UserContext } from '../../contexts/userContext';
import { Heading, PaperBox } from '../UI';

function SlideTransition(props) {
  return (
    <Slide
      {...props}
      direction="down"
    />
  );
}

function CredentialsSettings(props) {
  const { user, updateUser } = useContext(UserContext);
  const [username, updateUsername] = useTextfield(user.username);
  const [email, updateEmail] = useTextfield(user.email);
  const [errors, setErrors] = useState({});
  const [serverErrors, setServerErrors] = useState(null);
  const [snackOpen, toggleSnack] = useToggle(false);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setServerErrors(null);
    // Check username
    const usernameError =
      username === '' || !/^[a-zA-Z0-9\-_$@*!]{3,30}$/.test(username);
    // Check email
    const emailError = email === '' || !isEmail(email);

    setErrors((errors) => {
      return {
        ...errors,
        username: usernameError,
        email: emailError,
      };
    });

    if (usernameError || emailError) {
      return;
    }

    const response = await props.usersActions.updateUser(user._id, {
      username,
      email,
    });

    if (response.error) {
      return setServerErrors(response.messages);
    }

    toggleSnack(true);
    updateUser(response);
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
          Modifications enregistrées
        </Alert>
      </Snackbar>

      <PaperBox
        component="form"
        onSubmit={handleSubmit}
      >
        <Heading type="subtitle">Informations du compte</Heading>
        <Stack
          spacing={4}
          sx={{ marginBottom: '1rem' }}
        >
          {renderError()}
          <TextField
            label="Nom d'utilisateur"
            value={username}
            fullWidth
            onChange={updateUsername}
            error={errors && errors.username}
          />

          <TextField
            label="Adresse e-mail"
            type="email"
            value={email}
            fullWidth
            onChange={updateEmail}
            error={errors && errors.email}
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
            Enregister
          </Button>
        </Stack>
      </PaperBox>
    </React.Fragment>
  );

  function renderError() {
    if (!serverErrors) {
      return;
    }

    return (
      <Alert severity="error">
        <AlertTitle>Error</AlertTitle>
        {serverErrors}
      </Alert>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(null, mapDispatchToProps)(CredentialsSettings);
