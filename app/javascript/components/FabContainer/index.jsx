import React from "react";
import "./style";

export default ({ children, fab }) => (
  <div className="fab-container">
    {children}
    <div className="fab-container__fab">{fab}</div>
  </div>
);
