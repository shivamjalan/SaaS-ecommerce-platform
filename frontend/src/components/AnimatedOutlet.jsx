import { useEffect } from "react";

import {
  useLocation,
  useOutlet,
} from "react-router-dom";

import {
  motion,
} from "framer-motion";

/* ===================================================== */
/* ============= SMOOTH PAGE TRANSITIONS =============== */
/* ===================================================== */

const easeOut = [0.16, 1, 0.3, 1];

const AnimatedOutlet = () => {

  const location =
    useLocation();

  const outlet =
    useOutlet();

  // Scroll to top on every route change
  useEffect(() => {

    window.scrollTo(
      0,
      0
    );

  }, [location.pathname]);

  return (

    <motion.div
      key={location.pathname}
      initial={{
        opacity: 0,
        y: 10,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        duration: 0.18,
        ease: easeOut,
      }}
    >

      {outlet}

    </motion.div>
  );
};

export default AnimatedOutlet;
