import * as React from "react";

import type { Button_With_Icon } from "../types";

const ButtonWithIcon = ({
  action,
  disabled,
  image,
  text,
  textBeforeIcon,
}: Button_With_Icon): JSX.Element => {
  return (
    <button
      type="button"
      onClick={action}
      disabled={disabled}
      className="button-with-icon"
    >
      {textBeforeIcon && text}
      <img
        src={image}
        alt=""
        className={
          textBeforeIcon
            ? "button-with-icon__icon button-with-icon__icon--after"
            : "button-with-icon__icon"
        }
      />
      {!textBeforeIcon && text}
    </button>
  );
};

export default ButtonWithIcon;
