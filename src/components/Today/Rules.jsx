import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function Rules({ timers, onClose }) {
  return (
    <Dialog
      open
      onClose={onClose}
    >
      <DialogTitle>Règles</DialogTitle>
      <Divider />
      <DialogContent>
        <DialogContentText>
          Vous avez <b>5</b> essaie pour trouver la musique du jour.
        </DialogContentText>
        <DialogContentText>
          Le mode de jeu est en "Facile". C'est-à-dire que le nom du film ou la
          série peut être un raccourci. Les accents et majuscules de ne sont
          également pas pris en compte.
        </DialogContentText>
        <DialogContentText>Examples:</DialogContentText>
        <ul>
          <li>
            Le Seigneur des anneaux : La Communauté de l'anneau{' '}
            <ArrowForwardIcon
              style={{ transform: 'translateY(2px)' }}
              fontSize="12px"
            />{' '}
            Le Seigneur des anneaux
          </li>
          <li>
            Poster of movie X-Files : Aux frontières du réel{' '}
            <ArrowForwardIcon
              style={{ transform: 'translateY(2px)' }}
              fontSize="12px"
            />{' '}
            X-Files
          </li>
        </ul>

        <DialogContentText>
          À chaque étape, vous avez du temps supplémentaires:
        </DialogContentText>
        <ol>
          {timers.map((timer) => {
            return <li key={timer}>{timer} secondes</li>;
          })}
        </ol>

        <DialogContentText>
          À chaque étapes egalement, vous aurez un nouvel indice:
        </DialogContentText>
        <ol>
          <li>Aucun indice</li>
          <li>Date de réalisation | Dates de diffusion de la séries</li>
          <li>Réalisateurs | Network (chaine tv ou plateforme de VOD)</li>
          <li>Casting principal</li>
          <li>Synopsis</li>
        </ol>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={onClose}
          autoFocus
          variant="contained"
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default Rules;
