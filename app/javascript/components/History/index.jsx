import React, { useEffect } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

export default ({ onMount, priceRecords }) => {
  useEffect(() => {
    onMount();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>日期</TableCell>
            <TableCell>星期</TableCell>
            <TableCell>時間</TableCell>
            <TableCell align="right">菜價</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {priceRecords.map(({ id, updatedAt, price }) => (
            <TableRow key={id}>
              <TableCell>{updatedAt.toLocaleDateString()}</TableCell>
              <TableCell>
                {new Date().toLocaleDateString(undefined, {
                  weekday: "narrow",
                })}
              </TableCell>
              <TableCell>
                {updatedAt.getHours() < 12 ? "上午" : "下午"}
              </TableCell>
              <TableCell align="right">{price}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
