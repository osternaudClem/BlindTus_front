import { Typography } from '@mui/material';
import Binoculars from '../assets/images/binoculars.svg';

function NotFound() {
  return (
    <div>
      <img src={Binoculars} />
      <Typography variant="h3">Page introuvable</Typography>
      <Typography>
        La page que vous recherchez a été déplacée, effacée, renommée, ou n'a
        peut-être jamais existé.
      </Typography>
    </div>
  );
}

export default NotFound;
