import { toggleWeather } from "../../store/slice/environmentSlice";

import "./styles.scss";
import { RootState, useAppDispatch, useAppSelector } from "../../store/store";

const RainToggleButton = () => {
  const dispatch = useAppDispatch();
  const environment = useAppSelector((state: RootState) => state.environment);
  const { weather } = environment;

  const rainButtonHandler = () => {
    dispatch(toggleWeather());
  };

  return (
    <div className='wrapper'>
      <div
        className={`button ${weather === 'rain' ? 'active' : ''}`}
        onClick={rainButtonHandler}
      >
        <div className='icon'>
          <i className='fas fa-cloud-rain'></i>
        </div>
      </div>
    </div>
  );
};

export default RainToggleButton;
