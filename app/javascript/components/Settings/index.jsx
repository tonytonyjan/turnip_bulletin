import React, { useRef, Fragment } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default ({ island, resident, onSave }) => {
  const inputIsland = useRef(null);
  const inputResident = useRef(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    onSave({
      island: inputIsland.current.value,
      resident: inputResident.current.value,
    });
  };
  return (
    <form onSubmit={handleSubmit}>
      <TextField
        inputRef={inputIsland}
        required
        margin="normal"
        label="我的島嶼名稱"
        placeholder="ex. 香菇寮島"
        fullWidth
        defaultValue={island}
      />
      <TextField
        inputRef={inputResident}
        required
        margin="normal"
        label="我在島嶼上的名字"
        fullWidth
        defaultValue={resident}
      />
      <Button color="primary" type="submit">
        儲存
      </Button>
    </form>
  );
};
