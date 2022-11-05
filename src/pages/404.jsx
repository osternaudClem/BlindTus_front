import { Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Binoculars from '../assets/images/binoculars--light.svg';
import { HeaderNotLogged } from '../components/Header';
import { PaperBox } from '../components/UI';

function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="ErrorPage">
      <HeaderNotLogged />
      <Container maxWidth="md">
        <PaperBox className="ErrorPage__container">
          <img
            src={Binoculars}
            alt="binoculars icon"
            style={{ width: '120px', fill: 'white' }}
            className="ErrorPage__image"
          />
          <Typography variant="h3">Page introuvable</Typography>
          <Typography marginY={2}>
            La page que vous recherchez a été déplacée, effacée, renommée, ou
            n'a peut-être jamais existé.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/')}
          >
            Retourner a l'accueil
          </Button>
        </PaperBox>
      </Container>
    </div>
  );
}

export default NotFound;
