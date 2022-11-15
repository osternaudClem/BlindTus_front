import React from 'react';
import { MovieCard } from '../Cards';
import './Result.scss';
import { PaperBox } from '../UI';

function Result({ music }) {
  return (
    <PaperBox className="Result">
      <MovieCard music={music} />
    </PaperBox>
  );
}

export default Result;
