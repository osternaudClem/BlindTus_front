import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReadLocalStorage } from 'usehooks-ts';
import { api } from '../../config';
const API = api[process.env.NODE_ENV];

function GamePlayer({ audioName, timecode, canPlay, isReady }) {
  const audioRef = useRef();
  const volume = useReadLocalStorage('player_volume');

  useEffect(() => {
    audioRef.current.volume = volume === null ? .7 : volume / 100;
  }, [volume]);

  const onCanPlayThrough = function() {
    audioRef.current.play();
    canPlay();
  }

  return (
    <audio
      src={`${API}/api/audio/${audioName}.mp3#t=${timecode}`}
      loop
      // autoPlay
      controls
      ref={audioRef}
      onCanPlayThrough={onCanPlayThrough}
    />
  );
}

GamePlayer.propTypes = {
  audioName: PropTypes.string.isRequired,
  canPlay: PropTypes.func,
  isReady: PropTypes.bool,
  timecode: PropTypes.number,
};

GamePlayer.defaultProps = {
  canPlay: () => {},
  isReady: false,
  timecode: 0,
};

export default GamePlayer;