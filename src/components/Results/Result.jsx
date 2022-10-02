import React from 'react';
import {
  Paper,
} from '@mui/material';
import { MovieCard } from '../Cards';
import './Result.scss';

function Result({ movie, music }) {
  return (
    <Paper elevation={2} className="Result">
      <MovieCard movie={movie} music={music} />
    </Paper>
  )
}

export default Result;