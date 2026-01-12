import { useSelector, useDispatch } from "react-redux";
import { toggleDayNight } from "../../store/slice/environmentSlice";
import "./styles.scss";
import { Link } from "react-router-dom";
import DarkLightSwitch from "../../components/DarkLightSwitch";
import { RootState } from "../../store/store";
import { getCurrentWindow } from "@tauri-apps/api/window";

export interface IDarkLightSwitchProps {
  theme: string;
}

const Header = () => {
  const environment = useSelector((state: RootState) => state.environment);
  const dispatch = useDispatch();
  const { mode } = environment;

  const daynightHandler = () => {
    dispatch(toggleDayNight());
  };

  const fullscreenHandler = async () => {
    try {
      const appWindow = getCurrentWindow();
      const isFullscreen = await appWindow.isFullscreen();
      await appWindow.setFullscreen(!isFullscreen);
    } catch (error) {
      const isFullscreen = !!document.fullscreenElement;
      if (!isFullscreen) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  return (
    <nav className="wrap">
      <Link to="/">
        <img src="/assets/icons/lofi-logo.gif" alt="" />
      </Link>
      <div className="nav-menu"></div>
      <div className="nav-menu">
        <div onClick={daynightHandler}>
          <DarkLightSwitch theme={mode} />
        </div>

        <button onClick={fullscreenHandler} className="fullscreen-btn">
          <i className="fas fa-expand fa-lg"></i>
        </button>
      </div>
    </nav>
  );
};

export default Header;
