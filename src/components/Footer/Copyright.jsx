import {
  Link,
  Typography,
} from '@mui/material';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://blindtus.cl3tus.com/">
        BlindTus
      </Link>{' '}
      {new Date().getFullYear()}
      {'. '}
      Créé par{' '}
      <Link color="inherit" href="https://twitter.com/Cl3tus_" target="_blank">
        @Cl3tus_
      </Link>{' '}
    </Typography>
  );
}

export default Copyright;