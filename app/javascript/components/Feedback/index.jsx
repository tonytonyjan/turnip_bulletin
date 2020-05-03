import React, { useEffect } from "react";

export default ({ onMount }) => {
  useEffect(() => {
    onMount();
  }, []);

  return (
    <iframe
      src="https://docs.google.com/forms/d/e/1FAIpQLSeP1L5QxAyPYUhumA1XaZ9QzhR2zQDqpEd7BZjIDlum7WnyPA/viewform?embedded=true"
      width="100%"
      height="1328"
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
    >
      Loading…
    </iframe>
  );
};
