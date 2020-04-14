import React from "react";
import Typography from "@material-ui/core/Typography";
import "./style";

export default ({ text }) => (
  <div className="list-item-metadata">
    <Typography variant="caption">{text}</Typography>
  </div>
);
