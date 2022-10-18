import { useState, useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Fade,
  Alert,
  AlertTitle,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { usersActions } from '../actions';
import { useTextfield } from '../hooks/formHooks';
import { updateTitle } from '../lib/document';
import { Copyright } from '../components/Footer';

function AskNewPassword(props) {
  const [email, updateEmail] = useTextfield();
  const [openSuccess, setOpenSuccess] = useState(0);
  const [serverErrors, setServerErrors] = useState(null);

  useEffect(() => {
    updateTitle('Demande d\'un nouveau mot de passe');
  }, []);

  const handleSubmit = async function (event) {
    event.preventDefault();
    setServerErrors(null);
    setOpenSuccess(false);

    if (!email) {
      return;
    }

    const user = await props.usersActions.askNewPassword(email);

    if (user.error) {
      return setServerErrors(user.messages);
    }

    setOpenSuccess(true);
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
        Mot de passe perdu ?
      </Typography>
      {openSuccess &&
        <Alert severity="success" sx={{ marginBottom: '24px' }}>
          <AlertTitle>Demande de nouveau mot de passe</AlertTitle>
          Un email vient de vous etre envoyé. La demande sera supprimer dans 48h.
        </Alert>
      }
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
        {renderError()}
        <Typography variant="body">Nous allons vous envoyer un lien pour vous aider à récupérer vos identifiants.</Typography>

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

        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Demander un nouveau mot de passe
        </Button>

        <Copyright sx={{ mt: 5 }} />
      </Box>
    </Box >
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
    users: state.users,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AskNewPassword)