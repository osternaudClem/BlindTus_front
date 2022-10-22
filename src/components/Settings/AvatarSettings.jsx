import React, { useState, useEffect, useContext } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

import {
  Divider,
  Typography,
  Paper,
  Grid,
  Stack,
  Box,
  Button,
  Avatar,
  IconButton,
  FormControlLabel,
  Switch,
} from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import CircleIcon from '@mui/icons-material/Circle';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import AdjustIcon from '@mui/icons-material/Adjust';
import { UserContext } from '../../contexts/userContext';
import { usersActions } from '../../actions';
import { objectToArray } from '../../lib/array';
import colors from '../../datas/colors/index';
import './Settings.scss';

const COLORS = objectToArray(colors);

function AvatarSettings(props) {
  const [avatar, setAvatar] = useState({});
  const { updateUser } = useContext(UserContext);
  const avatarSvg = createAvatar(style, { dataUri: true, backgroundColor: '#4f4f4f', radius: 100, scale: 80, ...avatar });
  const largeScreen = useMediaQuery(theme => theme.breakpoints.up('sm'));
  
  useEffect(() => {
    if (props.user.avatarSettings && props.user.avatarSettings.seed) {
      setAvatar(props.user.avatarSettings);
    }
    else {
      setAvatar({
        seed: props.user._id,
        textureChance: 100,
        mouthChance: 100,
        sidesChance: 100,
        topChance: 100,
      });
    }
  }, [props.user]);

  const handleCancelUpdate = function () {
    if (!props.user.avatar || props.user.avatar === '') {
      setAvatar(a => ({
        seed: props.user.username,
        colors: '',
        textureChance: 100,
        mouthChance: 100,
        sidesChance: 100,
        topChance: 100,
      }));
    }
    else {
      setAvatar(a => (props.user.avatarSettings));
    }
  }

  const handleUpdateAvatar = function (key, value) {
    setAvatar(a => ({
      ...a,
      [key]: value,
    }));
  }

  const handleClickSave = async function () {
    const updatedUser = await props.usersActions.updateUser(props.user._id, { avatar: avatarSvg, avatarSettings: avatar });
    updateUser(updatedUser);
  }


  if (!avatar.seed) {
    return;
  }

  return (
    <React.Fragment>
      <Typography variant="h3" component="h2" mb={2}>Avatar</Typography>
      <Paper sx={{ padding: '2rem' }}>
        <Grid container className="SettingsAvatar">
          <Grid
            item
            xs={12}
            md={3}
          >
            <Avatar
              src={avatarSvg}
              alt="Cl3tus"
              className="AvatarSettings__avatar"
            />
          </Grid>
          <Grid
            item
            xs={12}
            md={9}
          >
            <Stack
              direction="column"
              alignItems="space-between"
              spacing={{ xs: 2 }}
              sx={{ height: '100%' }}
            >
              <Box sx={{ flex: 1 }}>
                <Stack direction="row" spacing={{ xs: 2 }} sx={{ marginBottom: '1rem' }} className="SettingsAvatar__buttons">
                  <Button
                    variant="contained"
                    startIcon={<ShuffleIcon />}
                    onClick={() => handleUpdateAvatar('seed', `${props.user.username}-${Math.random() * 1000}`)}>
                    Nouvel avatar aléatoire
                  </Button>
                  <Button
                    variant="outlined"
                    color="warning"
                    startIcon={<ShuffleIcon />}
                    onClick={handleCancelUpdate}>
                    Réinitialiser
                  </Button>
                </Stack>
                {COLORS.map((color, index) => {
                  return (
                    <span key={index}>
                      <IconButton
                        sx={{ color: color[600] }}
                        onClick={() => handleUpdateAvatar('colors', Object.keys(colors)[index])}
                      >
                        {avatar.colors === Object.keys(colors)[index]
                          ? <AdjustIcon />
                          : <CircleIcon />
                        }
                      </IconButton>
                      {index === 8 && <br />}
                    </span>
                  )
                })}

                <Stack
                  direction={largeScreen ? 'row' : 'column'}
                  spacing={{ xs: 2 }}
                  sx={{ marginTop: '1rem' }}
                >
                  <FormControlLabel
                    control={
                      <Switch color="primary" checked={parseInt(avatar.textureChance) === 100}
                      />
                    }
                    label="Texture"
                    labelPlacement="top"
                    onChange={() => handleUpdateAvatar('textureChance', parseInt(avatar.textureChance) === 100 ? 0 : 100)}
                  />

                  <FormControlLabel
                    control={
                      <Switch color="primary" checked={parseInt(avatar.mouthChance) === 100} />
                    }
                    label="Bouche"
                    labelPlacement="top"
                    onChange={() => handleUpdateAvatar('mouthChance', parseInt(avatar.mouthChance) === 100 ? 1 : 100)}
                  />

                  <FormControlLabel
                    control={
                      <Switch color="primary" checked={parseInt(avatar.sidesChance) === 100} />
                    }
                    label="Oreilles"
                    labelPlacement="top"
                    onChange={() => handleUpdateAvatar('sidesChance', parseInt(avatar.sidesChance) === 100 ? 1 : 100)}
                  />

                  <FormControlLabel
                    control={
                      <Switch color="primary" checked={parseInt(avatar.topChance) === 100} />
                    }
                    label="Chapeau"
                    labelPlacement="top"
                    onChange={() => handleUpdateAvatar('topChance', parseInt(avatar.topChance) === 100 ? 1 : 100)}
                  />
                </Stack>
              </Box>
              <Box>
                <Divider sx={{ marginBottom: '1rem' }} />
                <Stack
                  direction="row"
                  justifyContent="flex-end"
                  spacing={{ xs: 2 }}
                >
                  <Button onClick={handleClickSave} align="right" variant="contained">Enregister</Button>
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper >
    </React.Fragment >
  )
}

function mapStateToProps(state) {
  return {
    user: state.users.me,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    usersActions: bindActionCreators(usersActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AvatarSettings);