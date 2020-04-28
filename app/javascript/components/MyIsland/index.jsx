import React, { useRef, useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import zones from "./zones.json";
import { timezoneToOffsetName } from "utils";
import DialogSelect from "components/DialogSelect";

const zoneOptions = zones
  .filter(({ id }) => timezoneToOffsetName(id))
  .map(({ id, name }) => ({
    id,
    name,
    offsetName: timezoneToOffsetName(id),
  }));

export default ({ island, resident, timezone, onSave, onMount }) => {
  const inputIsland = useRef(null);
  const inputResident = useRef(null);
  const inputTimezone = useRef(null);
  useEffect(() => {
    onMount();
  }, []);
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
      <DialogSelect
        options={zoneOptions}
        name="timezone"
        label="島嶼時區"
        defaultSelectedOption={zoneOptions.find(
          (zoneOption) => zoneOption.id === timezone
        )}
        optionValue={(option) => option.id}
        optionPrimaryLabel={(option) => option.name}
        optionSecondaryLabel={(option) => option.offsetName}
        renderTextField={(props) => (
          <TextField {...props} margin="normal" fullWidth />
        )}
        inputRef={inputTimezone}
      />
      <Button color="primary" type="submit">
        儲存
      </Button>
    </form>
  );
};
