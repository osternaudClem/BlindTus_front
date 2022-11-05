import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography } from '@mui/material';

function Copyright(props) {
  return (
    <div>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {'Copyright © '}
        <Link
          color="inherit"
          href="https://blindtus.cl3tus.com/"
        >
          BlindTus
        </Link>{' '}
        {new Date().getFullYear()}
        {'. '}
        Créé par{' '}
        <Link
          color="inherit"
          href="https://twitter.com/Cl3tus_"
          target="_blank"
        >
          @Cl3tus_
        </Link>{' '}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        <Link
          component={RouterLink}
          to="/privacy"
          style={{ color: 'white', marginRight: '16px' }}
        >
          Confidentialité
        </Link>
        <Link
          component={RouterLink}
          to="/terms"
          style={{ color: 'white', marginRight: '16px' }}
        >
          Mentions legales
        </Link>
        <Link
          href="mailto:contact@cl3tus.com"
          style={{ color: 'white', marginRight: '16px' }}
        >
          Contact
        </Link>
      </Typography>
    </div>
  );
}

export default Copyright;
