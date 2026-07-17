"use client";

import { useEffect, useState } from "react";

/**
 * Live countdown to a unix-seconds target.
 * @param {number|bigint|string} target unix timestamp (seconds)
 * @returns {{ days:number, hours:number, minutes:number, seconds:number, total:number, done:boolean }}
 */
export function useCountdown(target) {
  const compute = () => {
    const now = Math.floor(Date.now() / 1000);
    const total = Math.max(0, Number(target) - now);
    return {
      total,
      done: total <= 0,
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    };
  };

  const [state, setState] = useState(compute);

  useEffect(() => {
    setState(compute());
    const id = setInterval(() => setState(compute()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [String(target)]);

  return state;
}

export default useCountdown;
