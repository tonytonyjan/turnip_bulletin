export default new Promise((resolve, reject) => {
  const request = self.indexedDB.open("turnip-bulletin", 2);
  request.onerror = ({ target: { error } }) => reject(error);
  request.onsuccess = ({ target: { result: db } }) => {
    db.onerror = ({ target: { error } }) => console.error(error);
    resolve(db);
  };
  request.onupgradeneeded = ({ oldVersion, target: { result: db } }) => {
    if (oldVersion < 1) {
      db.createObjectStore("friends");
      db.createObjectStore("settings");
    }
    if (oldVersion < 2) {
      db.createObjectStore("badges");
    }
  };
});
