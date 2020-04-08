import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import PriceCard from "components/PriceCard";
import Center from "components/Center";
import FabContainer from "components/FabContainer";
import "./style";

export default ({ priceRecords }) => {
  const [first, ...rest] = priceRecords;
  return (
    <div className="home">
      <FabContainer
        fab={
          <Fab color="primary">
            <AddIcon />
          </Fab>
        }
      >
        {!first ? (
          <Center text="沒有資料" />
        ) : (
          <Fragment>
            <PriceCard {...first} />
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
                    {rest.map(({ id, island, resident, price, createdAt }) => (
                      <TableRow key={id}>
                        <TableCell component="th" scope="row">
                          {island}
                        </TableCell>
                        <TableCell>{resident}</TableCell>
                        <TableCell align="right">{price}</TableCell>
                        <TableCell>{createdAt}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Fragment>
        )}
      </FabContainer>
    </div>
  );
};
