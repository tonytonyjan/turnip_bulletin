import React, { useEffect } from "react";

export default ({ onMount }) => {
  useEffect(() => {
    onMount();
  }, []);

  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLSeP1L5QxAyPYUhumA1XaZ9QzhR2zQDqpEd7BZjIDlum7WnyPA/viewform?embedded=true"
      style={{
        width: "100%",
        height: "calc(100vh - 148px)",
      }}
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
    >
      Loading…
    </iframe>
  );
};
