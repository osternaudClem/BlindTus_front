import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from 'usehooks-ts';

import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import { isMobileDevice } from '../../lib/check';
import { GameVolume } from '../Game';
import logo from '../../assets/logo_light.png';

const pages = [
  {
    label: 'Démarer une partie',
    url: '/game',
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

const ResponsiveAppBar = (props) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [volume, setVolume] = useLocalStorage('player_volume', 70);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = (page) => {
    if (page.url) {
      navigate(page.url);
    }
    setAnchorElNav(null);
  };

  const onClickLogo = () => {
    navigate('/');
  };

  return (
    <AppBar position="sticky">
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
                width: { xs: '100%', md: 'auto' },
              }}
            >
              {pages.map((page) => (
                <MenuItem
                  key={page.label}
                  onClick={() => handleCloseNavMenu(page)}
                >
                  <Typography textAlign="center">{page.label}</Typography>
                </MenuItem>
              ))}
              <Box sx={{ padding: '16px' }}>
                <Button
                  onClick={() => handleCloseNavMenu({ url: '/login' })}
                  variant="outlined"
                  sx={{ mb: 2, display: 'block' }}
                  color="success"
                >
                  Se connecter
                </Button>
                <Button
                  onClick={() => handleCloseNavMenu({ url: '/signup' })}
                  variant="contained"
                  sx={{ display: 'block' }}
                >
                  Créer un compte
                </Button>
              </Box>
            </Menu>
          </Box>
          <Box sx={{ flexGrow: { xs: 1, md: 0 } }}>
            <img
              src={logo}
              alt="BlindTus logo"
              onClick={() => onClickLogo()}
              className="Header__logo"
            />
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
          {!isMobileDevice() && (
            <div
              style={{ flexGrow: 0, display: 'flex' }}
              className="Header__volume-container"
            >
              <GameVolume
                className="Header__volume"
                onChange={(event, newValue) => setVolume(newValue)}
                value={volume}
              />
            </div>
          )}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
            <Button
              onClick={() => handleCloseNavMenu({ url: '/login' })}
              variant="outlined"
              sx={{ my: 2, display: 'block' }}
              color="success"
            >
              Se connecter
            </Button>
            <Button
              onClick={() => handleCloseNavMenu({ url: '/signup' })}
              variant="contained"
              sx={{ my: 2, display: 'block', marginLeft: '16px' }}
            >
              Créer un compte
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default ResponsiveAppBar;
