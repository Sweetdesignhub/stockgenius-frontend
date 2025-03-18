export function isWithinActiveHours() {
    const now = new Date();
    const start = new Date();
    start.setHours(9, 30, 0, 0); // 9:30 AM
  
    const end = new Date();
    end.setHours(16, 30, 0, 0); // 4:30 PM
  
    return now >= start && now <= end;
  }
  