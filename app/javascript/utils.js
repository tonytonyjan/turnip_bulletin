export const parseTimezoneToOffset = (timezone) => {
  return (
    (timezone[0] === "+" ? 1 : -1) * parseInt(timezone.slice(1, 3)) * 60 +
    parseInt(timezone.slice(4))
  );
};

export const adjustTimezone = (time, timezone) => {
  time = new Date(time.getTime());
  time.setMinutes(
    time.getMinutes() +
      time.getTimezoneOffset() +
      parseTimezoneToOffset(timezone)
  );
  return time;
};
