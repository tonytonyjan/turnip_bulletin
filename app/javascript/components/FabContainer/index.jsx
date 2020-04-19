import React from "react";
import "./style";

export default ({ children }) => (
  <div className="fab-container">
    <div className="fab-container__fabs">
      {React.Children.map(children, (child) => (
        <div className="fab-container__fab">{child}</div>
      ))}
    </div>
    {React.Children.map(children, () => (
      <div className="fab-container__spacing" />
    ))}
  </div>
);
