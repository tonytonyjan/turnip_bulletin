import React from "react";
import "./style";

export default ({ children }) => (
  <div className="fab-container">
    <div className="fab-container__fabs">
      {React.Children.map(Array(children), (child) => (
        <div className="fab-container__fab">{child}</div>
      ))}
    </div>
  </div>
);
