import React, { Fragment, useState, useRef } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import SendIcon from "@material-ui/icons/Send";
import HotelIcon from "@material-ui/icons/Hotel";
import PriceCard from "components/PriceCard";
import FabContainer from "components/FabContainer";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import "./style";

export default ({ priceRecords, onAddPrice, disabled }) => {
  const [first, ...rest] = priceRecords;
  const [openDialog, setOpenDialog] = useState(false);
  const inputPrice = useRef(null);
  const handleCloseDialog = () => setOpenDialog(false);
  const handleSubmit = (event) => {
    event.preventDefault();
    onAddPrice(inputPrice.current.value);
    setOpenDialog(false);
  };
  return (
    <div className="home">
      <FabContainer
        fab={
          <Fab
            disabled={disabled}
            color="primary"
            onClick={() => setOpenDialog(true)}
          >
            {disabled ? <HotelIcon /> : <SendIcon />}
          </Fab>
        }
      >
        <Fragment>
          {first && <PriceCard {...first} />}
          <div className="home__table">
            <TableContainer component={Paper}>
              <Table aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>島嶼</TableCell>
                    <TableCell>島民</TableCell>
                    <TableCell align="right">時價</TableCell>
                    <TableCell>時間</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rest.map(({ id, island, resident, price, time }) => (
                    <TableRow key={id}>
                      <TableCell component="th" scope="row">
                        {island}
                      </TableCell>
                      <TableCell>{resident}</TableCell>
                      <TableCell align="right">{price}</TableCell>
                      <TableCell>{time}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Fragment>
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
