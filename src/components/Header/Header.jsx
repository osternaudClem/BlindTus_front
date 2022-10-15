import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, redirect } from 'react-router-dom';
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

import { isMobileDevice } from '../../lib/check';
import { UserContext } from '../../contexts/userContext';
import { PlayerVolume } from '../Forms';
import logo from '../../assets/logo_light.png';

import './Header.scss';

const pages = [
  {
    label: 'Démarer une partie',
    url: '/new-game'
  },
  {
    label: 'Partie du jour',
    url: '/playtoday',
  },
  {
    label: 'Multijoueur',
    url: '/lobby',
  },
  {
    label: 'Suggérer un film',
    url: '/suggest-movie',
    color: '#af79ff'
  }
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

  useEffect(() => {
  }, [user]);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = page => {
    if (page.url) {
      navigate(page.url, { replace: true});

      if (page.url === '/lobby') {
        navigate(0);
      }
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
    <AppBar position="sticky" className="Header">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
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
          <Box sx={{ flexGrow: { xs: 1, md: 0 } }}>
            <img src={logo} className="Header__logo" alt="BlindTus logo" onClick={() => onClickLogo()} />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page.label}
                onClick={() => handleCloseNavMenu(page)}
                sx={{ my: 2, color: page.color || 'white', display: 'block' }}
              >
                {page.label}
              </Button>
            ))}
          </Box>
          {!isMobileDevice() &&
            <div style={{ flexGrow: 0, display: 'flex' }} className="Header__volume-container">
              <PlayerVolume
                className="Header__volume"
                onChange={(event, newValue) => setVolume(newValue)}
                value={volume}
              />
            </div>
          }
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Utilisateur">
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
