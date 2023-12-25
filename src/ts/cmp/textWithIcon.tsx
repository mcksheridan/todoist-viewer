import * as React from "react";

type Text_With_Icon = {
  elementType?: "time" | "li";
  key?: string;
  image: string;
  text: string;
};

const TextWithIcon = ({
  elementType,
  image,
  key,
  text,
}: Text_With_Icon): JSX.Element => {
  const CLASS_NAME = "text-with-icon";
  const content = (
    <>
      <img src={image} alt="" className="text-with-icon__icon" />
      {text}
    </>
  );

  if (elementType === "time") {
    return <time className={CLASS_NAME}>{content}</time>;
  }

  if (elementType === "li") {
    return (
      <li key={key} className={CLASS_NAME}>
        {content}
      </li>
    );
  }

  return <span className={CLASS_NAME}>{content}</span>;
};

export default TextWithIcon;