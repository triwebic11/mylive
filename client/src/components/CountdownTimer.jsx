// CountdownTimer.jsx
import { useEffect, useState } from "react";

const CountdownTimer = ({ targetDate }) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    if (!targetDate) return;

    const end = new Date(targetDate);

    const interval = setInterval(() => {
      const now = new Date();
      const diff = end - now;

      if (diff <= 0) {
        setCountdown("Expired");
        clearInterval(interval);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setCountdown(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <span className="text-sm font-bold uppercase">{countdown}</span>
  );
};

export default CountdownTimer;
