import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  CssBaseline,
  Box,
  Container,
  Typography,
  Button,
  Stack,
} from '@mui/material';

import { musicsActions } from '../actions';
import React from 'react';

function Test() {
  const str = "Crème Brulée"
  str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const proposals = [
    [
      "Requiem for a Dream",
      "Green Book : Sur les routes du Sud",
      "Sleepy Hollow : La légende du cavalier sans tête",
      "American History X",
      "Rasta Rockett",
      "Premier Contact",
      "Gatsby le Magnifique",
      "Battle Royale",
      "Love Actually",
      "Twilight, chapitre 1 : Fascination"
    ],
    [
      "Daredevil",
      "Les Aventuriers de l'arche perdue",
      "Kick-Ass",
      "Edge of Tomorrow",
      "Les Blues Brothers",
      "Le Dernier Samouraï",
      "Independence Day",
      "Deadpool",
      "Braveheart",
      "Matrix"
    ],
    [
      "Green Book : Sur les routes du Sud",
      "Le Loup de Wall Street",
      "Gatsby le Magnifique",
      "Blade Runner 2049",
      "Cloud Atlas",
      "Titanic",
      "Mary et Max.",
      "Apollo 13",
      "The Breakfast Club",
      "Requiem for a Dream"
    ],
    [
      "Top Gun",
      "Iron Man",
      "Baywatch : Alerte à Malibu",
      "La Planète des singes : Les Origines",
      "Pearl Harbor",
      "OSS 117 : Le Caire, nid d'espions",
      "Bodyguard",
      "Le Dernier Samouraï",
      "Avatar",
      "Le Cinquième Élément"
    ],
    [
      "Le Cinquième Élément",
      "Jumanji",
      "Astérix & Obélix : Mission Cléopâtre",
      "Speed",
      "Jurassic Park",
      "L'Histoire sans fin",
      "Le Dernier des Mohicans",
      "Wonder Woman",
      "Independence Day",
      "Men in Black"
    ]
  ]

  const string = 'Le Cinquième Élément';
  const answer = 'le cinquieme element';

  console.log('>>> clean', string.normalize("NFD").replace(/[\u0300-\u036f]/g, ""));


console.log('>>> proposals', proposals)
  return (
    <Box>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3">Test</Typography>

        <Box sx={{ '& button': { m: 1 } }}>
          <Stack
            direction="row"
          >
            {renderButton(0)}
          </Stack>
          <Stack
            direction="row"
          >
           {renderButton(2)}
          </Stack>
          <Stack
            direction="row"
          >
            {renderButton(4)}
          </Stack>
        </Box>


      </Container>
    </Box>
  )

  function renderButton(index) {
    return (
      <React.Fragment>
        <Button variant="outlined" sx={{ flex: 1}} size="large">{proposals[0][index]}</Button>
        <Button variant="outlined" sx={{ flex: 1}} size="large">{proposals[0][index+1]}</Button>
      </React.Fragment>
    )
  }
}

function mapStateToProps(state) {
  return {
    musics: state.musics,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    musicsActions: bindActionCreators(musicsActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Test);