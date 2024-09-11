const startHour = 9;
const startMin = 30;


const endHour = 15;
const endMin = 30;

const getCurrentISTTime = () => {
  const now = new Date();
  return new Date(now.getTime());
};

export const isWithinTradingHours = () => {
  const istTime = getCurrentISTTime();
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();

  return (
    (hours > startHour || (hours === startHour && minutes >= startMin)) &&
    (hours < endHour || (hours === endHour && minutes <= endMin))
  );
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
