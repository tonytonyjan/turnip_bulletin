import React, { useState, useEffect, useCallback } from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import HomeIcon from "@material-ui/icons/Home";
import PeopleIcon from "@material-ui/icons/People";
import SettingsIcon from "@material-ui/icons/Settings";
import Home from "components/Home";
import MyFriends from "components/MyFriends";
import Settings from "components/Settings";
import db from "db";
import "./style";

export default () => {
  const [page, setPage] = useState("home");
  const [priceRecords, setPriceRecords] = useState([]);
  const [friends, setfriends] = useState([]);
  const [settings, setSettings] = useState({ island: "", resident: "" });

  const handleSave = useCallback(
    ({ island, resident }) => {
      db.then((db) => {
        const transaction = db.transaction("settings", "readwrite");
        const store = transaction.objectStore("settings");
        store.put(island, "island");
        store.put(resident, "resident");
        transaction.oncomplete = () => setSettings({ island, resident });
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
        if (response.ok);
      });
    },
    [settings]
  );

  useEffect(() => {
    db.then((db) => {
      db.transaction("friends").objectStore("friends").getAll().onsuccess = ({
        target: { result: friends },
      }) => setfriends(friends);
    });
  }, []);

  useEffect(() => {
    const settings = {};
    db.then((db) => {
      db
        .transaction("settings")
        .objectStore("settings")
        .openCursor().onsuccess = ({ target: { result: cursor } }) => {
        if (cursor) {
          settings[cursor.key] = cursor.value;
          cursor.continue();
        } else setSettings(settings);
      };
    });
  }, []);

  useEffect(() => {
    if (friends.length === 0) {
      setPriceRecords([]);
      return;
    }
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
            createdAt: priceRecord.created_at,
          }))
        );
      });
  }, [friends, settings]);

  let children;

  switch (page) {
    case "home":
      children = (
        <Home priceRecords={priceRecords} onAddPrice={handleAddPrice} />
      );
      break;
    case "myFriends":
      children = (
        <MyFriends
          friends={friends}
          onAddFriend={handleAddFriend}
          onDeleteFriend={handleDeleteFriend}
        />
      );
      break;
    case "settings":
      children = (
        <Settings
          island={settings.island}
          resident={settings.resident}
          onSave={handleSave}
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
            label="首頁"
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
    </div>
  );
};
