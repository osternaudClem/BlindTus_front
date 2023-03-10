import { useEffect } from 'react';
import { Grid } from '@mui/material';
import { tmdb } from '../../config';
import logo from '../../assets/logo_light.png';
import './Background.scss';

function SemiBackground({ cover, getCover }) {
  useEffect(() => {
    if (!cover) {
      getCover();
    }
  }, [cover, getCover]);

  return (
    <Grid
      item
      sm={false}
      md={6}
      sx={{
        backgroundImage: `url(${tmdb.image_path}${cover})`,
        backgroundColor: (t) =>
          t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
      }}
      className="LoginPage__cover"
    >
      <img
        src={logo}
        alt="BlindTus logo"
        className="LoginPage__logo"
      />
    </Grid>
  );
}

export default SemiBackground;
