import * as React from "react";

type Text_With_Icon = {
  elementType?: "time" | "li";
  hasWarning?: boolean;
  image: string;
  text: string;
};

const TextWithIcon = ({
  elementType,
  hasWarning,
  image,
  text,
}: Text_With_Icon): JSX.Element => {
  const CLASS_NAME = "text-with-icon";
  const content = (
    <>
      <img src={image} alt="" className="text-with-icon__icon" />
      {hasWarning ? <span className="warning-text">{text}</span> : text}
    </>
  );

  if (elementType === "time") {
    return <time className={CLASS_NAME}>{content}</time>;
  }

  if (elementType === "li") {
    return <li className={CLASS_NAME}>{content}</li>;
  }

  return <span className={CLASS_NAME}>{content}</span>;
};

export default TextWithIcon;
