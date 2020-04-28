import React, { Fragment, useState } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import InputAdornment from "@material-ui/core/InputAdornment";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import { makeStyles } from "@material-ui/core/styles";
import { useRef } from "react";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
  },
}));

export default ({
  options,
  name,
  label,
  optionValue,
  optionPrimaryLabel,
  optionSecondaryLabel,
  renderTextField,
  inputRef,
  defaultSelectedOption,
}) => {
  const [open, setOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption);
  const selectedListItemRef = useRef(null);
  const classes = useStyles();
  const handleFocus = (event) => {
    event.target.blur();
    setOpen(true);
  };
  const handleClose = () => setOpen(false);
  const handleListItemClick = (option) => {
    setSelectedOption(option);
    setOpen(false);
  };

  const handleEnter = () => {
    selectedListItemRef.current && selectedListItemRef.current.scrollIntoView();
  };

  return (
    <Fragment>
      {renderTextField({
        onFocus: handleFocus,
        value: selectedOption ? optionPrimaryLabel(selectedOption) : "",
        label,
        InputProps: {
          endAdornment: (
            <InputAdornment position="start">
              <ArrowDropDownIcon />
            </InputAdornment>
          ),
        },
      })}
      <input
        type="hidden"
        name={name}
        value={selectedOption ? optionValue(selectedOption) : ""}
        ref={inputRef}
      />
      <Dialog
        fullScreen
        onClose={handleClose}
        open={open}
        onEnter={handleEnter}
      >
        <DialogTitle disableTypography>
          <Typography variant="h6">{label}</Typography>
          <IconButton onClick={handleClose} className={classes.closeButton}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <List>
            {options.map((option) => {
              const isSelected =
                selectedOption &&
                optionValue(selectedOption) === optionValue(option);
              return (
                <ListItem
                  ref={isSelected ? selectedListItemRef : null}
                  selected={isSelected}
                  button
                  onClick={() => handleListItemClick(option)}
                  key={optionValue(option)}
                >
                  <ListItemText
                    primary={optionPrimaryLabel(option)}
                    secondary={
                      optionSecondaryLabel && optionSecondaryLabel(option)
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
      </Dialog>
    </Fragment>
  );
};
