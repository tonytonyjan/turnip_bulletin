import React, { useState, useRef } from "react";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import Center from "components/Center";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import FabContainer from "components/FabContainer";
import "./style";

export default ({ friends, onDeleteFriend, onAddFriend }) => {
  const [targetFriend, setTargetFriend] = useState({
    island: "",
    resident: "",
  });
  const [openDialogDeleteFriend, setOpenDialogDeleteFriend] = useState(false);
  const [openDialogAddFriend, setOpenDialogAddFriend] = useState(false);

  const inputIsland = useRef(null);
  const inputResident = useRef(null);

  const handleCloseDialogDeleteFriend = () => setOpenDialogDeleteFriend(false);
  const handleCloseDialogAddFriend = () => setOpenDialogAddFriend(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    onAddFriend(inputIsland.current.value, inputResident.current.value);
    setOpenDialogAddFriend(false);
  };

  return (
    <div className="my-friends">
      <FabContainer
        fab={
          <Fab color="primary" onClick={() => setOpenDialogAddFriend(true)}>
            <AddIcon />
          </Fab>
        }
      >
        {friends.length === 0 ? (
          <Center text="沒有朋友" />
        ) : (
          <List>
            {friends.map(({ island, resident }) => (
              <ListItem key={island + resident}>
                <ListItemText primary={island} secondary={resident} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={() => {
                      setTargetFriend({
                        island,
                        resident,
                      });
                      setOpenDialogDeleteFriend(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
      </FabContainer>

      <Dialog
        open={openDialogDeleteFriend}
        onClose={handleCloseDialogDeleteFriend}
      >
        <DialogTitle>
          將「{targetFriend.island} {targetFriend.resident}」刪除嗎？
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleCloseDialogDeleteFriend} color="primary">
            取消
          </Button>
          <Button
            onClick={() => {
              onDeleteFriend(targetFriend.island, targetFriend.resident);
              setOpenDialogDeleteFriend(false);
            }}
            color="primary"
          >
            刪除
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDialogAddFriend}
        onClose={handleCloseDialogAddFriend}
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={handleSubmit}>
          <DialogTitle>新增菜友</DialogTitle>
          <DialogContent>
            <TextField
              inputRef={inputIsland}
              required
              autoFocus
              margin="normal"
              label="島嶼名稱"
              placeholder="ex. 香菇寮島"
              fullWidth
            />
            <TextField
              inputRef={inputResident}
              required
              margin="normal"
              label="居民名稱"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialogAddFriend} color="primary">
              取消
            </Button>
            <Button type="submit" color="primary">
              儲存
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};
