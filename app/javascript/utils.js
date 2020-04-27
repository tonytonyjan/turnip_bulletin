export const timezoneToOffsetName = (timezone) =>
  // Thanks France for embracing UTC notation instead of abbreviations
  new Intl.DateTimeFormat("fr", {
    timeZoneName: "short",
    timeZone: timezone,
  })
    .formatToParts(new Date())
    .find((i) => i.type === "timeZoneName").value;

export const isValidTimezone = (timeZone) => {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone)
    throw "Time zones are not available in this environment";

  try {
    Intl.DateTimeFormat(undefined, { timeZone });
    return true;
  } catch (error) {
    return false;
  }
};
