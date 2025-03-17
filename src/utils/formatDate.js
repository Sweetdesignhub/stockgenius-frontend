// const getOrdinalSuffix = (day) => {
//   if (day > 3 && day < 21) return "th"; // Covers 11th - 19th
//   switch (day % 10) {
//     case 1:
//       return "st";
//     case 2:
//       return "nd";
//     case 3:
//       return "rd";
//     default:
//       return "th";
//   }
// };

// export const formatDate = (dateString) => {
//   if (!dateString) return "";

//   const date = new Date(dateString);
//   if (isNaN(date)) return "";

//   // Convert to IST using toLocaleString (Strict)
//   const istDateString = new Intl.DateTimeFormat("en-IN", {
//     timeZone: "Asia/Kolkata",
//     day: "2-digit",
//     month: "short",
//     year: "numeric",
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false, // 24-hour format
//   }).format(date);

//   // Extract parts correctly
//   const [day, month, year, time] = istDateString.replace(",", "").split(" ");

//   // Get ordinal suffix
//   const dayNumber = parseInt(day, 10);
//   const ordinalSuffix = getOrdinalSuffix(dayNumber);

//   return `${dayNumber}${ordinalSuffix}-${month}-${year} , ${time}`;
// };


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

export const formatDate = (dateString, region = "india") => {
  if (!dateString) return "";

  const date = new Date(dateString);
  if (isNaN(date)) return "";

  // Select the correct timezone based on region
  const timeZone = region === "usa" ? "America/New_York" : "Asia/Kolkata";
  const timeZoneLabel = region === "usa" ? "EST" : "IST";

  // Format date correctly
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    timeZone,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

  // Format time separately
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 24-hour format
  }).format(date);

  // Extract day, month, and year
  const [month, day, year] = formattedDate.replace(",", "").split(" ");

  // Ensure day is correctly extracted and formatted
  const dayNumber = parseInt(day, 10);
  const ordinalSuffix = getOrdinalSuffix(dayNumber);

  return `${dayNumber}${ordinalSuffix}-${month}-${year}, ${formattedTime} (${timeZoneLabel})`;
};
