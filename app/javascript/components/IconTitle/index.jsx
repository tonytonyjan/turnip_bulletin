import React from "react";
import Typography from "@material-ui/core/Typography";
import "./style";

export default ({ image, grayscale, text }) => (
  <div className="icon-title">
    <div
      className={
        grayscale
          ? "icon-title__image icon-title__image--grayscale"
          : "icon-title__image"
      }
      style={{ backgroundImage: `url(${image})` }}
    />
    <div className="icon-title__text">
      <Typography variant="subtitle1">{text}</Typography>
    </div>
  </div>
);
