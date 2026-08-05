import {
  Component,
} from "react";

import { motion } from "framer-motion";

import { FaExclamationTriangle } from "react-icons/fa";

import { SectionLabel } from "./ui/badge";

import { Button } from "./ui/button";

/* ===================================================== */
/* =============== GLOBAL ERROR BOUNDARY =============== */
/* ===================================================== */

class ErrorBoundary extends Component {

  constructor(props) {

    super(props);

    this.state = {
      hasError: false,
      error: null,
    };

  }

  /* ===================================================== */
  /* ============== DERIVED STATE FROM ERROR ============= */
  /* ===================================================== */

  static getDerivedStateFromError(error) {

    return {
      hasError: true,
      error,
    };

  }

  /* ===================================================== */
  /* ================= LOG THE CAUGHT ERROR ============== */
  /* ===================================================== */

  componentDidCatch(error, errorInfo) {

    console.error(
      "ErrorBoundary caught an error:",
      error,
      errorInfo
    );

  }

  /* ===================================================== */
  /* ==================== FALLBACK UI ==================== */
  /* ===================================================== */

  render() {

    if (this.state.hasError) {

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >

            <div className="gradient-bg h-20 w-20 rounded-2xl flex items-center justify-center shadow-accent mb-8">

              <FaExclamationTriangle
                className="text-white text-4xl"
              />

            </div>

            <SectionLabel>

              Unexpected Error

            </SectionLabel>

            <h1 className="mt-6 text-4xl md:text-5xl font-display text-foreground">

              Something went{" "}

              <span className="gradient-text">

                wrong

              </span>

            </h1>

            <p className="mt-4 text-muted-foreground max-w-md leading-relaxed">

              An unexpected error interrupted this page. Try reloading,
              or head back to the home page.

            </p>

            <div className="mt-4 max-w-md w-full bg-muted rounded-2xl p-4 font-mono text-xs text-muted-foreground break-all">

              {this.state.error?.message || "Unknown error"}

            </div>

            <Button
              onClick={() => window.location.reload()}
              className="mt-8"
              size="lg"
            >

              Reload Page

            </Button>

          </motion.div>

        </div>
      );

    }

    return this.props.children;

  }

}

export default ErrorBoundary;
