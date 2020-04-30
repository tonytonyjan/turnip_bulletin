import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import HomeIcon from "@material-ui/icons/Home";
import HistoryIcon from "@material-ui/icons/History";
import PeopleIcon from "@material-ui/icons/People";
import SettingsIcon from "@material-ui/icons/Settings";
import CloseIcon from "@material-ui/icons/Close";
import Badge from "@material-ui/core/Badge";
import Home from "components/Home";
import MyFriends from "components/MyFriends";
import Settings from "components/Settings";
import History from "components/History";
import MyIsland from "components/MyIsland";
import ReturnablePage from "components/ReturnablePage";
import Twitter from "components/Twitter";
import Feedback from "components/Feedback";
import { makeStyles } from "@material-ui/core/styles";
import db from "db";
import { config as configGtag } from "gtag";
import "./style";

const handleClickSend = () =>
  gtag("event", "Open price-sending dialog", {
    event_category: "Homepage",
    event_label: "Click on price-sending FAB",
  });
const handleClickRefresh = () =>
  gtag("event", "Refresh page", {
    event_category: "Homepage",
    event_label: "Click on page-refreshing FAB",
  });
const handleSubmitPriceRecord = (event) =>
  gtag(
    "event",
    new FormData(event.target).get("text")
      ? "Send price with message"
      : "Send price without message",
    {
      event_category: "Homepage",
      event_label: 'Click on button "send"',
      value: 1,
    }
  );
const handleClickAddFriend = () =>
  gtag("event", "Open friends-adding dialog", {
    event_category: "Friends",
    event_label: "Click on friends-adding FAB",
  });
const handleSubmitNewFriend = () =>
  gtag("event", "Add friend", {
    event_category: "Friends",
    event_label: 'Click on button "save"',
    value: 1,
  });
const handleClickPredictionLink = () =>
  gtag("event", "Click outbound link", {
    event_category: "History",
    event_label: "Click https://turnipprophet.io/",
  });

const useStyles = makeStyles(() => ({
  snackbar: {
    bottom: 72,
  },
  snackbarAboveFab: {
    bottom: 192,
  },
}));

const twoDigit = (input) => ("0" + input).slice(-2);

const formatDuration = (duration) => {
  return `${twoDigit(Math.floor(duration / 3600000))}:${twoDigit(
    Math.ceil((duration % 3600000) / 60000)
  )}`;
};

const handleClickBack = () => {
  window.history.back();
};

const defaultSettings = {
  island: "",
  resident: "",
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export default () => {
  const classes = useStyles();
  const [initialized, setInitialized] = useState(false);
  const [page, setPage] = useState("home");
  const [priceRecords, setPriceRecords] = useState([]);
  const [friends, setfriends] = useState([]);
  const [settings, setSettings] = useState(defaultSettings);
  const [snackbar, setSnackbar] = useState({ message: "", open: false });
  const [myPriceRecords, setMyPriceRecords] = useState([]);
  const [badgeOfSettings, setBadgeOfSettings] = useState(false);
  const handleMountMap = useMemo(
    () => ({
      home: () => configGtag({ page_path: "/" }),
      myFriends: () => configGtag({ page_path: "/friends" }),
      settings: () => {
        configGtag({ page_path: "/settings" });
        setBadgeOfSettings(false);
      },
      history: () => configGtag({ page_path: "/history" }),
      myIsland: () => configGtag({ page_path: "/my_island" }),
      news: () => configGtag({ page_path: "/news" }),
      feedback: () => configGtag({ page_path: "/feedback" }),
    }),
    []
  );

  const handleSnackbarClose = useCallback(() => {
    setSnackbar((state) => ({ ...state, open: false }));
  }, [setSnackbar]);

  const handleSave = useCallback(
    (upcomingSettings) => {
      const newSettings = Object.entries(upcomingSettings).reduce(
        (result, [key, value]) => {
          result[key] = value || defaultSettings[key];
          return result;
        },
        {}
      );
      db.then((db) => {
        const transaction = db.transaction("settings", "readwrite");
        const store = transaction.objectStore("settings");
        Object.entries(newSettings).forEach(([key, value]) =>
          store.put(value, key)
        );
        transaction.oncomplete = () => {
          if (newSettings.timezone !== settings.timezone) {
            fetch("/price_records/update_timezone", {
              headers: { "Content-Type": "application/json" },
              method: "PATCH",
              body: JSON.stringify({
                island: newSettings.island,
                resident: newSettings.resident,
                timezone: newSettings.timezone,
              }),
            });
          }
          setSettings(newSettings);
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
    (price, text) => {
      if (!settings.island || !settings.resident) {
        setSnackbar({
          open: true,
          message: "請先到「設定」頁填寫島嶼名稱和名字",
        });
        return;
      }

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
            timezone: settings.timezone,
            text,
          },
        }),
      }).then((response) => {
        if (response.ok) {
          fetchPriceRecords();
          fetchMyPriceRecords();
        }
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
            text: priceRecord.text || "",
            expiration: new Date(Date.parse(priceRecord.expiration)),
            updatedAt: new Date(Date.parse(priceRecord.updated_at)),
            timezone: priceRecord.timezone,
          }))
        );
      });
  }, [friends, settings]);

  const fetchMyPriceRecords = useCallback(() => {
    if (!settings.island || !settings.resident) return;

    let oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const url = new URL("/price_records", window.location);
    url.searchParams.append("since", oneWeekAgo.toISOString());
    url.searchParams.append("friends[][island]", settings.island);
    url.searchParams.append("friends[][resident]", settings.resident);
    fetch(url)
      .then((response) => response.json())
      .then((priceRecords) => {
        setMyPriceRecords(
          priceRecords
            .sort(({ updated_at: a }, { updated_at: b }) => {
              if (a > b) return 1;
              else if (a < b) return -1;
              return 0;
            })
            .map((priceRecord) => ({
              id: priceRecord.id,
              island: priceRecord.island,
              resident: priceRecord.resident,
              price: priceRecord.price,
              expiration: new Date(Date.parse(priceRecord.expiration)),
              updatedAt: new Date(Date.parse(priceRecord.updated_at)),
              timezone: priceRecord.timezone,
            }))
        );
      });
  }, [settings]);

  const handleClickPage = useCallback((page) => {
    switch (page) {
      case "about":
        window.open("/about", "_blank");
        break;
      case "help":
        window.open("/help", "_blank");
        break;
      default:
        setPage(page);
        window.history.pushState({ page }, null);
        break;
    }
  }, []);

  useEffect(() => {
    window.history.replaceState({ page }, null);
    const handlePopState = ({ state }) => {
      if (!state) return;
      const { page } = state;
      if (!page) return;

      setPage(page);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

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
          const settings = { ...defaultSettings };
          db
            .transaction("settings")
            .objectStore("settings")
            .openCursor().onsuccess = ({ target: { result: cursor } }) => {
            if (cursor) {
              settings[cursor.key] = cursor.value || settings[cursor.key];
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

  useEffect(() => {
    if (initialized) fetchMyPriceRecords();
  }, [initialized, settings]);

  useEffect(() => {
    db.then((db) => {
      db
        .transaction("badges")
        .objectStore("badges")
        .get("settings").onsuccess = ({ target: { result } }) => {
        setBadgeOfSettings(!!result);
      };
    });
  }, []);

  useEffect(() => {
    db.then((db) => {
      db.transaction("badges", "readwrite")
        .objectStore("badges")
        .put(badgeOfSettings, "settings");
    });
  }, [badgeOfSettings]);

  let children;

  switch (page) {
    case "home":
      const now = new Date();
      const currentHour = parseInt(
        Intl.DateTimeFormat("zh-TW", {
          hour12: false,
          hour: "numeric",
          timeZone: settings.timezone,
        })
          .formatToParts(now)
          .find(({ type }) => type === "hour").value
      );
      children = (
        <Home
          priceRecords={priceRecords
            .filter((priceRecord) => priceRecord.expiration > now)
            .map(({ id, island, resident, price, expiration, text }) => ({
              id,
              island,
              resident,
              price,
              time: `${formatDuration(expiration - now)} 後逾期`,
              text,
            }))}
          expiredPriceRecords={priceRecords
            .filter((priceRecord) => priceRecord.expiration <= now)
            .map(({ id, island, resident, price, expiration, text }) => ({
              id,
              island,
              resident,
              price,
              time: `${formatDuration(now - expiration)} 前逾期`,
              text,
            }))}
          onAddPrice={handleAddPrice}
          disabled={currentHour < 8 || currentHour >= 22}
          onMount={handleMountMap[page]}
          onClickSend={handleClickSend}
          onClickRefresh={handleClickRefresh}
          onSubmit={handleSubmitPriceRecord}
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
          onClickAddFriend={handleClickAddFriend}
          onSubmit={handleSubmitNewFriend}
        />
      );
      break;
    case "settings":
      children = (
        <Settings
          onClickPage={handleClickPage}
          onMount={handleMountMap[page]}
        />
      );
      break;
    case "history":
      children = (
        <History
          priceRecords={myPriceRecords.filter(
            ({ timezone }) => timezone === settings.timezone
          )}
          onMount={handleMountMap[page]}
          onClickPredictionLink={handleClickPredictionLink}
        />
      );
      break;
    case "myIsland":
      children = (
        <ReturnablePage title="我的島嶼" onClickBack={handleClickBack}>
          <MyIsland
            island={settings.island}
            resident={settings.resident}
            timezone={settings.timezone}
            onSave={handleSave}
            onMount={handleMountMap[page]}
          />
        </ReturnablePage>
      );
      break;
    case "news":
      children = (
        <ReturnablePage title="最新消息" onClickBack={handleClickBack}>
          <Twitter twitterId="TurnipFriends" onMount={handleMountMap[page]} />
        </ReturnablePage>
      );
      break;
    case "feedback":
      children = <Feedback onMount={handleMountMap[page]} />;
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
          onChange={(_, newValue) => handleClickPage(newValue)}
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
            label="我的記錄"
            value="history"
            icon={<HistoryIcon />}
          />
          <BottomNavigationAction
            label="設定"
            value="settings"
            icon={
              <Badge
                color="secondary"
                variant="dot"
                badgeContent={badgeOfSettings ? 1 : 0}
              >
                <SettingsIcon />
              </Badge>
            }
          />
        </BottomNavigation>
      </div>
      <Snackbar
        className={
          page === "home" ? classes.snackbarAboveFab : classes.snackbar
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
