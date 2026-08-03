import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  animate,
  useInView,
} from "framer-motion";

/* ===================================================== */
/* ============== COUNT-UP STAT ANIMATION ============== */
/* ===================================================== */

const easeOut = [0.16, 1, 0.3, 1];

const CountUp = ({
  value,
  decimals = 0,
  suffix = "",
  prefix = "",
}) => {

  const ref = useRef(null);

  const inView =
    useInView(ref, {
      once: true,
      amount: 0.5,
    });

  const [display, setDisplay] =
    useState("0");

  useEffect(() => {

    if (!inView) return;

    const controls = animate(
      0,
      value,
      {
        duration: 1.8,
        ease: easeOut,
        onUpdate: (v) =>
          setDisplay(
            v.toFixed(decimals)
          ),
      }
    );

    return () =>
      controls.stop();

  }, [inView, value, decimals]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
};

export default CountUp;
