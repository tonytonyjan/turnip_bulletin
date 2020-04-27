export default new Promise((resolve, reject) => {
  const request = self.indexedDB.open("turnip-bulletin");
  request.onerror = ({ target: { error } }) => reject(error);
  request.onsuccess = ({ target: { result: db } }) => {
    db.onerror = ({ target: { error } }) => console.error(error);
    resolve(db);
  };
  request.onupgradeneeded = ({ target: { result: db } }) => {
    db.createObjectStore("friends");
    db.createObjectStore("settings");
  };
});
