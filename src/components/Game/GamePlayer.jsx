import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useReadLocalStorage } from 'usehooks-ts';
import { api } from '../../config';
const API = api[process.env.NODE_ENV];

function GamePlayer({ audioName, timecode, canPlay, showControl, isReady }) {
  const audioRef = useRef();
  const volume = useReadLocalStorage('player_volume');

  useEffect(() => {
    audioRef.current.volume = volume === null ? .7 : volume / 100;
  }, [volume]);

  useEffect(() => {
    if (isReady) {
      audioRef.current.play();
    }
  }, [isReady]);

  const onAudioProgress = function() {
    const duration = audioRef.current.duration;
    console.log('>>> duration', duration);
    console.log('>>> audioRef.current.buffered.length', audioRef.current.buffered.length);
    if (duration > 0) {
      for (let i = 0; i < audioRef.current.buffered.length; i++) {
        if (
          audioRef.current.buffered.start(audioRef.current.buffered.length - 1 - i) <
          audioRef.current.currentTime
        ) {
          console.log((audioRef.current.buffered.end(audioRef.current.buffered.length - 1 - i) * 100) / duration);
          break;
        }
      }
    }
  }

  return (
    <audio
      src={`${API}/api/audio/${audioName}.mp3#t=${timecode}`}
      loop
      // autoPlay
      controls={showControl}
      ref={audioRef}
      onCanPlayThrough={canPlay}
      onProgress={onAudioProgress}
    />
  );
}

GamePlayer.propTypes = {
  audioName: PropTypes.string.isRequired,
  canPlay: PropTypes.func,
  isReady: PropTypes.bool,
  showControl: PropTypes.bool,
  timecode: PropTypes.number,
};

GamePlayer.defaultProps = {
  canPlay: () => { },
  isReady: true,
  showControl: false,
  timecode: 0,
};

export default GamePlayer;