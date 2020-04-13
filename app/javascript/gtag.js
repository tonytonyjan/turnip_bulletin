export const config = (options) => {
  "gtag" in window &&
    process.env.GA_MEASUREMENT_ID &&
    gtag("config", process.env.GA_MEASUREMENT_ID, options);
};
