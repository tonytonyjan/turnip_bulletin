import React from "react";
import Typography from "@material-ui/core/Typography";
import "./style";

export default ({ text }) => (
  <div className="center">
    <Typography variant="h1">{text}</Typography>
  </div>
);
