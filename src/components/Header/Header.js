import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import { setCookie } from 'react-use-cookie';
import { createAvatar } from '@dicebear/avatars';
import * as style from '@dicebear/avatars-bottts-sprites';

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
  {
    label: 'Test',
    url: '/test',
  },
];

const settings = [
  {
    id: 'profile',
    label: 'Profile',
  },
  {
    id: 'history',
    label: 'Historique',
    url: '/history',
  },
  {
    id: 'logout',
    label: 'Logout',
    url: '/login',
  },
];

let svg = createAvatar(style, {
  seed: 'cl3tus',
  dataUri: true,
});

console.log('>>> svg', svg)
const ResponsiveAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
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
      setCookie('user', '', { days: 0 });
    }
    navigate(setting.url);
    setAnchorElUser(null);
  };

  const onClickLogo = () => {
    navigate('/');
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

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={props.users.me.username} src={svg} />
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
    users: state.users,
  }
}

export default connect(mapStateToProps, null)(ResponsiveAppBar);
