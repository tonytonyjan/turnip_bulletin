import React from "react";
import "./style";

export default ({ children }) => (
  <div className="fab-container">{children}</div>
);

export const Fabs = ({ children }) => (
  <div className="fab-container__fabs">
    {React.Children.map(children, (child) => (
      <div className="fab-container__fab">{child}</div>
    ))}
  </div>
);
