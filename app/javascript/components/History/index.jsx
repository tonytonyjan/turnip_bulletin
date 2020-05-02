import React, { useEffect, Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./style";

const createPredictUrl = (priceRecords) => {
  const prices = new Array(13);
  for (let i = priceRecords.length - 1; i >= 0; i--) {
    const { updatedAt, price } = priceRecords[i];
    const weekday = updatedAt.getDay();
    if (weekday === 0) {
      prices[0] = price;
      break;
    }
    prices[weekday * 2 - 1 + (updatedAt.getHours() < 12 ? 0 : 1)] = price;
  }
  return `https://turnipprophet.io/?prices=${prices.join(".")}`;
};

export default ({ onMount, priceRecords, onClickPredictionLink }) => {
  useEffect(() => {
    onMount();
  }, []);

  return (
    <Fragment>
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
            {priceRecords.map(({ id, updatedAt, price, timezone }) => {
              return (
                <TableRow
                  key={id}
                  className={
                    updatedAt.toLocaleDateString("en-US", {
                      weekday: "long",
                    }) === "Sunday"
                      ? "history__sunday-row"
                      : undefined
                  }
                >
                  <TableCell>
                    {updatedAt.toLocaleDateString("zh-TW", {
                      timeZone: timezone,
                    })}
                  </TableCell>
                  <TableCell>
                    {updatedAt.toLocaleDateString("zh-TW", {
                      weekday: "narrow",
                      timeZone: timezone,
                    })}
                  </TableCell>
                  <TableCell>
                    {
                      Intl.DateTimeFormat("zh-TW", {
                        hour12: true,
                        hour: "numeric",
                        timeZone: timezone,
                      })
                        .formatToParts(updatedAt)
                        .find(({ type }) => type === "dayPeriod").value
                    }
                  </TableCell>
                  <TableCell align="right">{price}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Button
        color="primary"
        href={createPredictUrl(priceRecords)}
        target="_blank"
        rel="noreferrer noopener"
        onClick={onClickPredictionLink}
      >
        走勢預測
      </Button>
      <Typography variant="caption">by turnipprophet.io</Typography>
    </Fragment>
  );
};
