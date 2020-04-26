import React, { useRef } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

export default ({ island, resident, timezone, onSave }) => {
  const inputIsland = useRef(null);
  const inputResident = useRef(null);
  const inputTimezone = useRef(null);
  const handleSubmit = (event) => {
    event.preventDefault();
    onSave(
      Array.from(new FormData(event.target)).reduce((result, [key, value]) => {
        result[key] = value;
        return result;
      }, {})
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        name="island"
        inputRef={inputIsland}
        required
        margin="normal"
        label="我的島嶼名稱"
        placeholder="ex. 今年一定島"
        fullWidth
        defaultValue={island}
        helperText="「島」字可有可無，和你的菜友約定好即可"
      />
      <TextField
        name="resident"
        inputRef={inputResident}
        required
        margin="normal"
        label="我在島嶼上的名字"
        fullWidth
        defaultValue={resident}
        placeholder="ex. 老任"
      />
      <TextField
        name="timezone"
        inputRef={inputTimezone}
        margin="normal"
        label="島嶼時區"
        fullWidth
        defaultValue={timezone}
        placeholder="ex. +08:00"
        inputProps={{ pattern: "[+-]\\d\\d:\\d\\d" }}
      />
      <Button color="primary" type="submit">
        儲存
      </Button>
    </form>
  );
};
