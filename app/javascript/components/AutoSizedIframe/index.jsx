import React, { useEffect, useRef, useCallback } from "react";

export default ({ src, onMount }) => {
  const iframeRef = useRef(null);
  useEffect(() => {
    onMount();
  }, []);

  const handleLoad = useCallback(() => {
    iframeRef.current.height =
      iframeRef.current.contentWindow.document.documentElement.scrollHeight + 1;
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={src}
      width="100%"
      frameBorder="0"
      marginHeight="0"
      marginWidth="0"
      onLoad={handleLoad}
    >
      Loading…
    </iframe>
  );
};
