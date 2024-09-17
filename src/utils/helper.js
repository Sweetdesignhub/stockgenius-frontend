import moment from "moment-timezone";

const startHour =9;
const startMin = 30;


const endHour = 15;
const endMin = 30;

const getCurrentISTTime = () => {
  const now = new Date();
  return new Date(now.getTime());
};

export const isWithinTradingHours = () => {
  const now = moment().tz("Asia/Kolkata");
    const day = now.day();
    const hour = now.hour();
    const minute = now.minute();

    // Check if it's a weekday (Monday to Friday)
    if (day >= 1 && day <= 5) {
        // Check if it's between 9:30 AM and 3:30 PM IST
        if ((hour > 9 || (hour === 9 && minute >= 30)) && (hour < 15 || (hour === 15 && minute <= 30))) {
            return true;
        }
    }

    return false;
};

export const isAfterMarketClose = () => {
  const istTime = getCurrentISTTime();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  return hours > endHour || (hours === endHour && minutes > endMin);
};

export const isBeforeMarketOpen = () => {
  const istTime = getCurrentISTTime();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  return hours < startHour || (hours === startHour && minutes < startMin);
};
