import React, { Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default () => (
  <Fragment>
    <TextField
      required
      margin="normal"
      label="我的島嶼名稱"
      placeholder="ex. 香菇寮島"
      fullWidth
    />
    <TextField required margin="normal" label="我在島嶼上的名稱" fullWidth />
    <Button color="primary">儲存</Button>
  </Fragment>
);
