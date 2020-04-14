import React, { Fragment, useState, useRef, useEffect } from "react";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import RefreshIcon from "@material-ui/icons/Refresh";
import HotelIcon from "@material-ui/icons/Hotel";
import FabContainer from "components/FabContainer";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ListItemMetadata from "components/ListItemMetadata";
import IconTitle from "components/IconTitle";
import Divider from "@material-ui/core/Divider";
import "./style";

const turnipImage = "/images/turnip.svg";

export default ({
  priceRecords,
  expiredPriceRecords,
  onAddPrice,
  disabled,
  onMount,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const inputPrice = useRef(null);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    onAddPrice(inputPrice.current.value);
    setOpenDialog(false);
  };
  const handleRefresh = () => window.location.reload();

  useEffect(() => {
    onMount("onMount");
  }, []);

  return (
    <div className="home">
      <IconTitle image={turnipImage} text="即時菜價" />
      {priceRecords.length === 0 ? (
        <Typography variant="h3" component="h1" align="center">
          沒有資料
        </Typography>
      ) : (
        <List>
          {priceRecords.map(({ id, island, resident, price, time }) => (
            <Fragment key={id}>
              <ListItem>
                <ListItemText
                  primary={price}
                  secondary={`${island} ${resident}`}
                />
                <ListItemMetadata text={time} />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}

      <IconTitle image={turnipImage} text="逾期菜價" grayscale />
      {expiredPriceRecords.length === 0 ? (
        <Typography variant="h3" component="h1" align="center">
          沒有資料
        </Typography>
      ) : (
        <List>
          {expiredPriceRecords.map(({ id, island, resident, price, time }) => (
            <Fragment key={id}>
              <ListItem>
                <ListItemText
                  primary={price}
                  secondary={`${island} ${resident}`}
                />
                <ListItemMetadata text={time} />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      )}
      <FabContainer>
        <Fab onClick={handleRefresh}>
          <RefreshIcon />
        </Fab>
        <Fab
          color="primary"
          onClick={disabled ? null : () => setOpenDialog(true)}
        >
          {disabled ? <HotelIcon /> : <SendIcon />}
        </Fab>
      </FabContainer>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <form onSubmit={handleSubmit}>
          <DialogTitle>報菜價</DialogTitle>
          <DialogContent>
            <TextField
              inputRef={inputPrice}
              required
              autoFocus
              margin="normal"
              label="菜價"
              fullWidth
              type="number"
              inputProps={{ min: 1 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              取消
            </Button>
            <Button type="submit" color="primary">
              送出
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
