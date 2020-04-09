import React, { useState, useEffect } from "react";
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
    db.then(
      (db) =>
        (db
          .transaction("friends", "readwrite")
          .objectStore("friends")
          .clear().onsuccess = ({ target: { source: store } }) =>
          friends.forEach((friend) =>
            store.add(friend, `${friend.island}_${friend.resident}`)
          ))
    );
  }, [friends]);

  useEffect(() => {
    db.then(
      (db) =>
        (db
          .transaction("settings", "readwrite")
          .objectStore("settings")
          .clear().onsuccess = ({ target: { source: store } }) => {
          Object.entries(settings).forEach(([key, value]) =>
            store.add(value, key)
          );
        })
    );
  }, [settings]);

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
            createdAt: priceRecords.created_at,
          }))
        );
      });
  }, [friends, settings]);

  let children;

  switch (page) {
    case "home":
      children = <Home priceRecords={priceRecords} />;
      break;
    case "myFriends":
      children = (
        <MyFriends
          friends={friends}
          onAddFriend={(island, resident) => {
            if (
              !friends.find(
                (friend) =>
                  friend.island === island && friend.resident === resident
              )
            )
              setfriends([...friends, { island, resident }]);
          }}
          onDeleteFriend={(island, resident) =>
            setfriends(
              friends.filter(
                (friend) =>
                  friend.island !== island || friend.resident !== resident
              )
            )
          }
        />
      );
      break;
    case "settings":
      children = (
        <Settings
          island={settings.island}
          resident={settings.resident}
          onSave={setSettings}
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
