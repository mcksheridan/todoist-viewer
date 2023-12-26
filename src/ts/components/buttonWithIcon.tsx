import * as React from "react";

import type { Button_With_Icon } from "../types";

const ButtonWithIcon = ({
  action,
  disabled,
  image,
  text,
  toggleTextDisplay,
  textBeforeIcon,
}: Button_With_Icon): JSX.Element => {
  const textElement = (
    <span
      className={
        toggleTextDisplay
          ? "button-with-icon__text button-with-icon__text--hidden"
          : "button-with-icon__text"
      }
    >
      {text}
    </span>
  );

  return (
    <button
      type="button"
      onClick={action}
      disabled={disabled}
      className="button-with-icon"
    >
      {textBeforeIcon && textElement}
      <img
        src={image}
        alt=""
        className={
          textBeforeIcon
            ? "button-with-icon__icon button-with-icon__icon--after"
            : "button-with-icon__icon"
        }
      />
      {!textBeforeIcon && textElement}
    </button>
  );
};

export default ButtonWithIcon;
