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

  // Convert to IST using toLocaleString (Strict)
  const istDateString = new Intl.DateTimeFormat("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
  }).format(date);

  // Extract parts correctly
  const [day, month, year, time] = istDateString.replace(",", "").split(" ");

  // Get ordinal suffix
  const dayNumber = parseInt(day, 10);
  const ordinalSuffix = getOrdinalSuffix(dayNumber);

  return `${dayNumber}${ordinalSuffix}-${month}-${year} , ${time}`;
};
