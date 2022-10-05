import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCookie } from 'react-use-cookie';
import { useLocalStorage } from 'usehooks-ts';

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { UserContext } from '../../contexts/userContext';
import { PlayerVolume } from '../Forms';
import logo from '../../assets/logo_light.png';

const pages = [
  {
    label: 'Démarer une partie',
    url: '/new-game'
  },
  {
    label: 'Partie du jour',
    url: '/today',
  },
  {
    label: 'Multijoueur',
    url: '/lobby',
  },
];

const settings = [
  {
    id: 'profile',
    label: 'Profile',
    url: '/settings',
  },
  {
    id: 'history',
    label: 'Historique',
    url: '/history',
  },
  {
    id: 'logout',
    label: 'Se déconnecter',
    url: '/login',
  },
];

const ResponsiveAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [volume, setVolume] = useLocalStorage('player_volume', 70);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = page => {
    if (page.url) {
      navigate(page.url);
    }
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = setting => {
    if (setting.id === 'logout') {
      setCookie('user', '', {
        days: 0,
        domain: !process.env.NODE_ENV || process.env.NODE_ENV === 'development' ? '' : '.cl3tus.com',
      });
    }
    navigate(setting.url);
    setAnchorElUser(null);
  };

  const onClickLogo = () => {
    navigate('/');
  }

  if (!props.user) {
    return <div>Loading ...</div>
  }

  return (
    <AppBar position="sticky">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page.label} onClick={() => handleCloseNavMenu(page)}>
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <img src={logo} height="40px" style={{ marginRight: '24px', cursor: 'pointer' }} alt="BlindTus logo" onClick={() => onClickLogo()} />
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}


          </Box>
          <div style={{ marginRight: '16px' }}>
            <PlayerVolume onChange={(event, newValue) => setVolume(newValue)} value={volume} />
          </div>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={props.user.username} src={user.avatar} sx={{ width: 50, height: 50 }} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting.id} onClick={() => handleCloseUserMenu(setting)}>
                  <Typography textAlign="center">{setting.label}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

function mapStateToProps(state) {
  return {
    user: state.users.me,
  }
}

export default connect(mapStateToProps, null)(ResponsiveAppBar);
