import React, { Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

export default ({ onClickBack, title, children }) => {
  return (
    <Fragment>
      <AppBar color="inherit" elevation={0}>
        <Toolbar>
          <IconButton edge="start" onClick={onClickBack}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">{title}</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      {children}
    </Fragment>
  );
};
