import React from "react";
import classnames from "classnames";
import marvel from "./images/marvel_bg-01.png";
import "./card.css";

const Card = ({ onClick, card, index, isInactive, isFlipped, isDisabled }) => {
  const handleClick = () => {
    !isFlipped && !isDisabled && onClick(index);
  };
  console.log(card.image.default)
  return (
    <div
      className={classnames("card", {
        "is-flipped": isFlipped,
        "is-inactive": isInactive
      })}
      onClick={handleClick}
    >
      <div className="card-face card-font-face">
        <img src={marvel} alt="marvel" />
      </div>
      <div className="card-face card-back-face bg-slate-300">
        <img src={card.image.default} alt="marvel" />
      </div>
    </div>
  );
};

export default Card;
