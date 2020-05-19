import React, { Fragment, useState, useEffect, useCallback } from "react";
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
import Badge from "@material-ui/core/Badge";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import SystemUpdateIcon from "@material-ui/icons/SystemUpdate";
import GitHubIcon from "@material-ui/icons/GitHub";
import "./style.css";

export default ({
  onClickPage,
  hasNewVersion,
  onAcceptUpdate,
  onRejectUpdate,
  onMount,
  releaseNotes,
}) => {
  useEffect(() => {
    onMount();
  }, []);

  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const handleCloseUpdateDialog = useCallback(() => {
    setOpenUpdateDialog(false);
  }, []);

  return (
    <Fragment>
      <List
        component="nav"
        className="settings__list"
        subheader={<ListSubheader>偏好設定</ListSubheader>}
      >
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
          <ListItemText
            primary="我的島嶼"
            secondary="設定島嶼名稱、名字、時區"
          />
        </ListItem>
        <ListItem
          button
          onClick={useCallback(() => {
            setOpenUpdateDialog(true);
          }, [])}
        >
          <ListItemAvatar>
            <Badge
              overlap="circle"
              color="secondary"
              variant="dot"
              badgeContent={hasNewVersion ? 1 : 0}
            >
              <Avatar>
                <SystemUpdateIcon />
              </Avatar>
            </Badge>
          </ListItemAvatar>
          <ListItemText primary="檢查更新" />
        </ListItem>
      </List>
      <List
        component="nav"
        className="settings__list"
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
          <ListItemText primary="關於我們" secondary="專案簡介、製作團隊簡介" />
        </ListItem>
        <ListItem
          component="a"
          button
          href="https://github.com/tonytonyjan/turnip_bulletin"
          target="_blank"
          rel="noreferrer noopener"
        >
          <ListItemAvatar>
            <Avatar>
              <GitHubIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="原始碼" secondary="歡迎貢獻" />
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
      <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        {hasNewVersion ? (
          <Fragment>
            <DialogContent>
              <Typography color="textSecondary" variant="body1" component="div">
                <div className="settings__update-content">
                  更新內容：
                  <ol className="settings__update-content-list">
                    {releaseNotes.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ol>
                </div>
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  handleCloseUpdateDialog();
                  onRejectUpdate();
                }}
                color="primary"
              >
                不更新
              </Button>
              <Button
                onClick={() => {
                  handleCloseUpdateDialog();
                  onAcceptUpdate();
                }}
                color="primary"
                autoFocus
              >
                立即更新
              </Button>
            </DialogActions>
          </Fragment>
        ) : (
          <Fragment>
            <DialogContent>
              <Typography color="textSecondary" variant="body1">
                已經是最新版本
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={handleCloseUpdateDialog}
                color="primary"
                autoFocus
              >
                我知道了
              </Button>
            </DialogActions>
          </Fragment>
        )}
      </Dialog>
    </Fragment>
  );
};
