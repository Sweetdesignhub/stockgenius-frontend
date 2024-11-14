/**
 * File: CountdownTimer
 * Description: This component is a simple countdown timer that calculates the time remaining until a specific target date and displays it. The component is designed to update the remaining time every second. It takes no external inputs but is hardcoded to count down to a target date (in this case, July 30, 2024). It calculates the difference between the current date and the target date and displays the time left in days, hours, minutes, and seconds. If the target date has passed, it shows a "Time's up!" message. The timer updates in real-time and is reset every second using the `setTimeout` function.
 *
 * Developed by: Arshdeep Singh
 * Developed on: 2024-11-14
 *
 * Updated by: [Name]
 * Updated on: [Update date]
 * - Update description: Brief description of what was updated or fixed
 */

import { useEffect, useState } from "react";

const CountdownTimer = () => {
  const calculateTimeLeft = () => {
    const difference = +new Date("2024-7-30") - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hrs: Math.floor((difference / (1000 * 60 * 60)) % 24),
        min: Math.floor((difference / 1000 / 60) % 60),
        sec: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval} className="mx-1 dark:text-white">
        {timeLeft[interval]} {interval}
      </span>
    );
  });

  return (
    <div className="text-xl text-gray-700 mt-4">
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
};

export default CountdownTimer;
