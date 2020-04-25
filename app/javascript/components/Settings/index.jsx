import React, { Fragment, useEffect, useCallback } from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

export default ({ onClickPage, onMount }) => {
  useEffect(() => {
    onMount();
  }, []);

  return (
    <Fragment>
      <List component="nav" subheader={<ListSubheader>偏好設定</ListSubheader>}>
        <ListItem
          button
          onClick={useCallback(() => {
            onClickPage("myIsland");
          }, [onClickPage])}
        >
          <ListItemAvatar>
            <Avatar>
              <AccountCircleIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="我的島嶼" secondary="設定島嶼名稱與名字" />
        </ListItem>
      </List>
    </Fragment>
  );
};
