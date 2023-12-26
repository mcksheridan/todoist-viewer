import * as React from "react";
import ButtonWithIcon from "./buttonWithIcon";
import { playIcon, stopIcon } from "../utilities/images";

import type { Loading_Screen } from "../types";

const LoadingScreen = ({
  hasAnimation = true,
  heading,
  message,
}: Loading_Screen): JSX.Element => {
  const [isPlaying, setIsPlaying] = React.useState(hasAnimation);

  const headerClasses = "heading loading__heading";

  return (
    <div className="loading">
      <h1
        className={
          hasAnimation && isPlaying
            ? headerClasses + " loading__heading--animated"
            : headerClasses
        }
      >
        {heading}
      </h1>
      <p className="subheading-text">{message}</p>
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
