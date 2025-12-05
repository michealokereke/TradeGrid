import { DateTime, Duration, Interval } from "luxon";

export const luxonUtils = {
  now() {
    return DateTime.utc();
  },
  addDaysToNow(days: number) {
    return DateTime.utc().plus({ days });
  },
};
