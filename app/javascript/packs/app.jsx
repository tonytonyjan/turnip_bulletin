require.context("../images", true);
import React from "react";
import ReactDOM from "react-dom";
import App from "components/App";

if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js");

ReactDOM.render(<App />, document.querySelector("#app"));
