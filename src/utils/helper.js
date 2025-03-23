// import moment from "moment-timezone";

// const startHour = 9;
// const startMin = 15;

// const endHour = 15;
// const endMin = 30;


// export const isWithinTradingHours = () => {
//   const now = moment().tz("Asia/Kolkata");
//   const day = now.day();
//   const hour = now.hour();
//   const minute = now.minute();

//   // Check if it's a weekday (Monday to Friday)
//   if (day >= 1 && day <= 5) {
//     // Check if it's between 9:30 AM and 3:30 PM IST
//     if (
//       (hour > startHour || (hour === startHour && minute >= startMin)) &&
//       (hour < endHour || (hour === endHour && minute <= endMin))
//     ) {
//       return true;
//     }
//   }

//   return false;
// };

// export const isAfterMarketClose = () => {
//   const now = moment().tz("Asia/Kolkata");
//   return now.isAfter(now.clone().set({ hour: endHour, minute: endMin }));
// };

// export const isBeforeMarketOpen = () => {
//   const now = moment().tz("Asia/Kolkata");
//   return now.isBefore(now.clone().set({ hour: startHour, minute: startMin }));
// };

import moment from "moment-timezone";

// India Market (NSE) Trading Hours
const startHourIST = 9;
const startMinIST = 15;
const endHourIST = 16;
const endMinIST = 0;

// US Market (NYSE/NASDAQ) Trading Hours
const startHourUS = 9;
const startMinUS = 30;
const endHourUS = 16;
const endMinUS = 0;

// ✅ Check if within India (NSE) trading hours
export const isWithinTradingHours = () => {
  const now = moment().tz("Asia/Kolkata");
  const day = now.day();
  const hour = now.hour();
  const minute = now.minute();

  if (day >= 1 && day <= 5) {
    if (
      (hour > startHourIST || (hour === startHourIST && minute >= startMinIST)) &&
      (hour < endHourIST || (hour === endHourIST && minute <= endMinIST))
    ) {
      return true;
    }
  }
  return false;
};

export const isAfterMarketClose = () => {
  const now = moment().tz("Asia/Kolkata");
  return now.isAfter(now.clone().set({ hour: endHourIST, minute: endMinIST }));
};

export const isBeforeMarketOpen = () => {
  const now = moment().tz("Asia/Kolkata");
  return now.isBefore(now.clone().set({ hour: startHourIST, minute: startMinIST }));
};

// ✅ Check if within US (NYSE/NASDAQ) trading hours
export const isWithinTradingHoursUS = () => {
  const now = moment().tz("America/New_York");
  const day = now.day();
  const hour = now.hour();
  const minute = now.minute();

  if (day >= 1 && day <= 5) {
    if (
      (hour > startHourUS || (hour === startHourUS && minute >= startMinUS)) &&
      (hour < endHourUS || (hour === endHourUS && minute <= endMinUS))
    ) {
      return true;
    }
  }
  return false;
};

export const isAfterMarketCloseUS = () => {
  const now = moment().tz("America/New_York");
  return now.isAfter(now.clone().set({ hour: endHourUS, minute: endMinUS }));
};

export const isBeforeMarketOpenUS = () => {
  const now = moment().tz("America/New_York");
  return now.isBefore(now.clone().set({ hour: startHourUS, minute: startMinUS }));
};
