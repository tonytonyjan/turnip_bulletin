import React, { Fragment, useState, useEffect, useCallback } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import Home from "components/Home";
import MyFriends from "components/MyFriends";
import Settings from "components/Settings";
import { makeStyles } from "@material-ui/core/styles";
import db from "db";
import { config as configGtag } from "gtag";
import "./style";

const useStyles = makeStyles(() => ({
  snackbar: {
    bottom: 72,
  },
  snackbarAboveFab: {
    bottom: 192,
  },
}));

const handleMountMap = {
  home: () => configGtag({ page_path: "/" }),
  myFriends: () => configGtag({ page_path: "/friends" }),
  settings: () => configGtag({ page_path: "/settings" }),
};

export default () => {
  const classes = useStyles();
  const [initialized, setInitialized] = useState(false);
  const [page, setPage] = useState("home");
  const [priceRecords, setPriceRecords] = useState([]);
  const [friends, setfriends] = useState([]);
  const [settings, setSettings] = useState({ island: "", resident: "" });
  const [snackbar, setSnackbar] = useState({ message: "", open: false });

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((state) => ({ ...state, open: false }));
  }, [setSnackbar]);

  const handleSave = useCallback(
    ({ island, resident }) => {
      db.then((db) => {
        const transaction = db.transaction("settings", "readwrite");
        const store = transaction.objectStore("settings");
        store.put(island, "island");
        store.put(resident, "resident");
        transaction.oncomplete = () => {
          setSettings({ island, resident });
          setSnackbar({ message: "已儲存", open: true });
        };
      });
    },
    [settings]
  );

  const handleDeleteFriend = useCallback(
    (island, resident) => {
      const key = `${island}_${resident}`;
      db.then((db) => {
        db
          .transaction("friends", "readwrite")
          .objectStore("friends")
          .delete(key).onsuccess = () => {
          setfriends(
            friends.filter(
              (friend) =>
                friend.island !== island || friend.resident !== resident
            )
          );
        };
      });
    },
    [friends]
  );

  const handleAddFriend = useCallback((island, resident) => {
    const key = `${island}_${resident}`;
    const value = { island, resident };
    db.then((db) => {
      db.transaction("friends").objectStore("friends").get(key).onsuccess = ({
        target: { result },
      }) => {
        if (!result)
          db
            .transaction("friends", "readwrite")
            .objectStore("friends")
            .add(value, key).onsuccess = () => setfriends([...friends, value]);
      };
    });
  });

  const handleAddPrice = useCallback(
    (price) => {
      if (!settings.island || !settings.resident) {
        setSnackbar({
          open: true,
          message: "請先到「設定」頁填寫島嶼名稱和名字",
        });
        return;
      }
      let timezone = new Date().getTimezoneOffset();
      timezone = `${timezone > 0 ? "-" : "+"}${(
        "0" + Math.abs(timezone / 60)
      ).slice(-2)}:00`;

      fetch("/price_records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          [document.querySelector("meta[name=csrf-param]")
            .content]: document.querySelector("meta[name=csrf-token]").content,
          price_record: {
            island: settings.island,
            resident: settings.resident,
            price,
            timezone,
          },
        }),
      }).then((response) => {
        if (response.ok) fetchPriceRecords();
      });
    },
    [settings]
  );

  const fetchPriceRecords = useCallback(() => {
    const url = new URL("/price_records", window.location);
    if (settings.island && settings.resident) {
      url.searchParams.append("friends[][island]", settings.island);
      url.searchParams.append("friends[][resident]", settings.resident);
    }
    friends.forEach(({ island, resident }) => {
      url.searchParams.append("friends[][island]", island);
      url.searchParams.append("friends[][resident]", resident);
    });
    fetch(url)
      .then((response) => response.json())
      .then((priceRecords) => {
        setPriceRecords(
          priceRecords.map((priceRecord) => ({
            id: priceRecord.id,
            island: priceRecord.island,
            resident: priceRecord.resident,
            price: priceRecord.price,
            time:
              new Date(Date.parse(priceRecord.updated_at)).getHours() < 12
                ? "上午"
                : "下午",
          }))
        );
      });
  }, [friends, settings]);

  useEffect(() => {
    db.then((db) => {
      Promise.all([
        new Promise((resolve) => {
          db
            .transaction("friends")
            .objectStore("friends")
            .getAll().onsuccess = ({ target: { result: friends } }) =>
            resolve(friends);
        }),
        new Promise((resolve) => {
          const settings = {};
          db
            .transaction("settings")
            .objectStore("settings")
            .openCursor().onsuccess = ({ target: { result: cursor } }) => {
            if (cursor) {
              settings[cursor.key] = cursor.value;
              cursor.continue();
            } else resolve(settings);
          };
        }),
      ]).then(([friends, settings]) => {
        setfriends(friends);
        setSettings(settings);
        setInitialized(true);
      });
    });
  }, []);

  useEffect(() => {
    if (initialized) fetchPriceRecords();
  }, [initialized, friends, settings]);

  let children;

  switch (page) {
    case "home":
      const currentHour = new Date().getHours();
      children = (
        <Home
          priceRecords={priceRecords}
          onAddPrice={handleAddPrice}
          disabled={currentHour < 8 || currentHour >= 22}
          onMount={handleMountMap[page]}
        />
      );
      break;
    case "myFriends":
      children = (
        <MyFriends
          friends={friends}
          onAddFriend={handleAddFriend}
          onDeleteFriend={handleDeleteFriend}
          onMount={handleMountMap[page]}
        />
      );
      break;
    case "settings":
      children = (
        <Settings
          island={settings.island}
          resident={settings.resident}
          onSave={handleSave}
          onMount={handleMountMap[page]}
        />
      );
      break;
    default:
      children = <h1>404</h1>;
      break;
  }

  return (
    <div className="app">
      <main className="app__main">{children}</main>
      <div className="app__nav">
        <BottomNavigation
          showLabels
          value={page}
          onChange={(_, newValue) => setPage(newValue)}
        >
          <BottomNavigationAction
            label="即時菜價"
            value="home"
            icon={<HomeIcon />}
          />
          <BottomNavigationAction
            label="我的菜友"
            value="myFriends"
            icon={<PeopleIcon />}
          />
          <BottomNavigationAction
            label="設定"
            value="settings"
            icon={<SettingsIcon />}
          />
        </BottomNavigation>
      </div>
      <Snackbar
        className={
          page === "settings" ? classes.snackbar : classes.snackbarAboveFab
        }
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        action={
          <Fragment>
            <IconButton
              size="small"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Fragment>
        }
      />
    </div>
  );
};
