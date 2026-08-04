import { useEffect } from "react";

import {
  useLocation,
  useOutlet,
} from "react-router-dom";

import {
  motion,
  AnimatePresence,
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

    <AnimatePresence mode="wait">

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

        exit={{
          opacity: 0,
          y: -10,
        }}

        transition={{
          duration: 0.18,
          ease: easeOut,
        }}
      >

        {outlet}

      </motion.div>

    </AnimatePresence>
  );
};

export default AnimatedOutlet;
