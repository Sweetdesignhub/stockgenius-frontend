const getOrdinalSuffix = (day) => {
  if (day > 3 && day < 21) return "th"; // Covers 11th - 19th
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date)) return "";

  // Convert to IST (Indian Standard Time)
  const options = {
    timeZone: "Asia/Kolkata",
    hour12: false, // 24-hour format
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  const day = date.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const ordinalSuffix = getOrdinalSuffix(day);
  const time = new Intl.DateTimeFormat("en-IN", options).format(date);

  return `${day}${ordinalSuffix}-${month}-${year} ,  ${time} IST`;
};
