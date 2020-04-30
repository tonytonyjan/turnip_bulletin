import React, { Fragment, useEffect, useCallback } from "react";
import ListSubheader from "@material-ui/core/ListSubheader";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import ListItemText from "@material-ui/core/ListItemText";
import InfoIcon from "@material-ui/icons/Info";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import HelpIcon from "@material-ui/icons/Help";
import TwitterIcon from "@material-ui/icons/Twitter";
import FeedbackIcon from "@material-ui/icons/Feedback";

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
          <ListItemText primary="我的島嶼" secondary="設定島嶼名稱、名字、時區" />
        </ListItem>
      </List>
      <List
        component="nav"
        subheader={<ListSubheader>資訊與支援</ListSubheader>}
      >
        <ListItem
          button
          onClick={useCallback(() => {
            onClickPage("about");
          }, [onClickPage])}
        >
          <ListItemAvatar>
            <Avatar>
              <InfoIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="關於我們"
            secondary="專案簡介、製作團隊簡介"
          />
        </ListItem>
        <ListItem
          button
          onClick={useCallback(() => {
            onClickPage("news");
          }, [onClickPage])}
        >
          <ListItemAvatar>
            <Avatar>
              <TwitterIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="最新消息" secondary="官方 Twitter" />
        </ListItem>
        <ListItem
          button
          onClick={useCallback(() => {
            onClickPage("help");
          }, [onClickPage])}
        >
          <ListItemAvatar>
            <Avatar>
              <HelpIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="幫助中心" secondary="使用說明、FAQ" />
        </ListItem>
        <ListItem
          button
          onClick={useCallback(() => {
            onClickPage("feedback");
          }, [onClickPage])}
        >
          <ListItemAvatar>
            <Avatar>
              <FeedbackIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary="建議回饋"
            secondary="發問、評價、回報問題、許願新功能"
          />
        </ListItem>
      </List>
    </Fragment>
  );
};
