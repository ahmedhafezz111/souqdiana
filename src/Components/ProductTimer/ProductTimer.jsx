import React, { useEffect, useState } from 'react';

export default function ProductTimer({ endDate }) {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const end = new Date(endDate);
      const diff = Math.max((end - now) / 1000, 0); // Ensure the difference is non-negative
      setCountdown(Math.floor(diff)); // Set countdown in seconds
    };

    calculateCountdown(); // Calculate countdown immediately
    const interval = setInterval(calculateCountdown, 1000); // Update countdown every second

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, [endDate]);

  const formatTimer = (seconds) => {
    if (seconds <= 0) {
      return "Expired";
    }

    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${days} days ${hours} hours ${minutes} minutes ${remainingSeconds} seconds`;
  };

  return (
    <p>Countdown Timer: {formatTimer(countdown)}</p>
  );
}
