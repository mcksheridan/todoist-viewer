import * as React from "react";
import ButtonWithIcon from "./buttonWithIcon";
import { playIcon, stopIcon } from "../utilities/images";

const LoadingScreen = (): JSX.Element => {
  const [isPlaying, setIsPlaying] = React.useState(true);

  const headerClasses = "heading loading__heading";

  return (
    <div className="loading">
      <h1
        className={
          isPlaying
            ? headerClasses + " loading__heading--animated"
            : headerClasses
        }
      >
        Loading
      </h1>
      <p className="subheading-text">Fetching data from Todoist</p>
      <div className="loading__control">
        <ButtonWithIcon
          action={() => setIsPlaying(!isPlaying)}
          image={isPlaying ? stopIcon.src : playIcon.src}
          text={isPlaying ? "Stop animation" : "Restart animation"}
        />
      </div>
    </div>
  );
};

export default LoadingScreen;
