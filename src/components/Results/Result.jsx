import React from 'react';
import { MovieCard } from '../Cards';
import './Result.scss';
import { PaperBox } from '../UI';

function Result({ movie, music }) {
  return (
    <PaperBox className="Result">
      <MovieCard
        movie={movie}
        music={music}
      />
    </PaperBox>
  );
}

export default Result;
