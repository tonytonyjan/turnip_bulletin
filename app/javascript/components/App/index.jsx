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
  const [priceRecords, setPriceRecords] = useState([
    {
      id: "123",
      island: "香菇寮島",
      resident: "大兜",
      price: 123,
      createdAt: "12:00",
    },
    {
      id: "122",
      island: "氨基酸島",
      resident: "賊魚",
      price: 1456,
      createdAt: "12:11",
    },
    {
      id: "121",
      island: "勁辣雞腿島",
      resident: "安安",
      price: 32,
      createdAt: "12:00",
    },
    {
      id: "1231",
      island: "香菇寮島",
      resident: "大兜",
      price: 123,
      createdAt: "12:00",
    },
    {
      id: "1221",
      island: "氨基酸島",
      resident: "賊魚",
      price: 1456,
      createdAt: "12:11",
    },
    {
      id: "1211",
      island: "勁辣雞腿島",
      resident: "安安",
      price: 32,
      createdAt: "12:00",
    },
    {
      id: "1232",
      island: "香菇寮島",
      resident: "大兜",
      price: 123,
      createdAt: "12:00",
    },
    {
      id: "1222",
      island: "氨基酸島",
      resident: "賊魚",
      price: 1456,
      createdAt: "12:11",
    },
    {
      id: "1212",
      island: "勁辣雞腿島",
      resident: "安安",
      price: 32,
      createdAt: "12:00",
    },
    {
      id: "1233",
      island: "香菇寮島",
      resident: "大兜",
      price: 123,
      createdAt: "12:00",
    },
    {
      id: "1223",
      island: "氨基酸島",
      resident: "賊魚",
      price: 1456,
      createdAt: "12:11",
    },
    {
      id: "1213",
      island: "勁辣雞腿島",
      resident: "安安",
      price: 32,
      createdAt: "12:00",
    },
  ]);
  const [friends, setfriends] = useState([]);
  const [island, setIsland] = useState("");
  const [resident, setResident] = useState("");

  useEffect(() => {
    db.then((db) => {
      db.transaction("friends").objectStore("friends").getAll().onsuccess = ({
        target: { result: friends },
      }) => setfriends(friends);
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
      children = <Settings island={island} resident={resident} />;
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
