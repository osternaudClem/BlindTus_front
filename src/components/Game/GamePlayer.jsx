import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReadLocalStorage } from 'usehooks-ts';
import { api } from '../../config';
const API = api[process.env.NODE_ENV];

function GamePlayer({ audioName, timecode }) {
  const audioRef = useRef();
  const volume = useReadLocalStorage('player_volume');

  useEffect(() => {
    audioRef.current.volume = volume === null ? .7 : volume / 100;
  }, [volume]);
  
  return (
    <audio
      src={`${API}/api/audio/${audioName}.mp3#t=${timecode}`}
      loop
      autoPlay
      // controls
      ref={audioRef}
    />
  );
}

GamePlayer.propTypes = {
  audioName: PropTypes.string.isRequired,
  timecode: PropTypes.number,
};

GamePlayer.defaultProps = {
  timecode: 0,
};

export default GamePlayer;