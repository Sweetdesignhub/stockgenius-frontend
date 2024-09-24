import moment from "moment-timezone";

// const startHour = 9;
// const startMin = 15;

// const endHour = 15;
// const endMin = 30;
const startHour = 3;  // 9:15 AM IST converted to 3:45 AM UTC
const startMin = 45;  // 45 minutes


const endHour = 10;  // 3:30 PM IST converted to 10:00 AM UTC
const endMin = 0;    // 0 minutes

const getCurrentISTTime = () => {
  const now = new Date();
  return new Date(now.getTime());
};

// export const isWithinTradingHours = () => {
//   const istTime = getCurrentISTTime();
//   const hours = istTime.getHours();
//   const minutes = istTime.getMinutes();

//   return (
//     (hours > startHour || (hours === startHour && minutes >= startMin)) &&
//     (hours < endHour || (hours === endHour && minutes <= endMin))
//   );
// };

export const isWithinTradingHours = () => {
  // const now = moment().tz("Asia/Kolkata");
  const now = moment().utc(); 
  const day = now.day();
  const hour = now.hour();
  const minute = now.minute();

  // Check if it's a weekday (Monday to Friday)
  if (day >= 1 && day <= 5) {
    // Check if it's between 9:30 AM and 3:30 PM IST
    if (
      (hour > startHour || (hour === startHour && minute >= startMin)) &&
      (hour < endHour || (hour === endHour && minute <= endMin))
    ) {
      return true;
    }
  }

  return false;
};

export const isAfterMarketClose = () => {
  // const now = moment().tz("Asia/Kolkata");
  const now = moment().utc(); // Using Central Time
  return now.isAfter(now.clone().set({ hour: endHour, minute: endMin }));
};

export const isBeforeMarketOpen = () => {
  // const now = moment().tz("Asia/Kolkata");
  const now = moment().utc(); // Using Central Time
  return now.isBefore(now.clone().set({ hour: startHour, minute: startMin }));
};
