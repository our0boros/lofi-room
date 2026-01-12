import{ useState } from 'react';

import { chill, jazzy, sleep } from '../../data/songData';
import './styles.scss';
import Player from '../../components/Player'
import { RootState, useAppSelector } from '../../store/store';

const Footer = () => {
  const environment = useAppSelector((state: RootState) => state.environment);

  const { mood } = environment;

  const [currentSongIndex, setCurrentSongIndex] = useState(0);

  return (
    <div className='footer'>
      <div className='song-name'>
        {mood === 'chill' ? (
          <span>Song name: {chill[currentSongIndex].name}</span>
        ) : mood === 'jazzy' ? (
          <span>Song name: {jazzy[currentSongIndex].name}</span>
        ) : (
          <span>Song name: {sleep[currentSongIndex].name}</span>
        )}
      </div>
      <div className='controller'>
        {mood === 'chill' ? (
          <Player
            currentSongIndex={currentSongIndex}
            setCurrentSongIndex={setCurrentSongIndex}
            songs={chill}
          />
        ) : mood === 'jazzy' ? (
          <Player
            currentSongIndex={currentSongIndex}
            setCurrentSongIndex={setCurrentSongIndex}
            songs={jazzy}
          />
        ) : (
          <Player
            currentSongIndex={currentSongIndex}
            setCurrentSongIndex={setCurrentSongIndex}
            songs={sleep}
          />
        )}
      </div>
    </div>
  );
};

export default Footer;
