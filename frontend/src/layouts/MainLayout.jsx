import AnimatedOutlet from "../components/AnimatedOutlet";
import Navbar from "../components/Navbar";
import ErrorBoundary from "../components/ErrorBoundary";

const MainLayout = () => {
  return (
    <ErrorBoundary>

      <Navbar />

      <AnimatedOutlet />

    </ErrorBoundary>
  );
};

export default MainLayout;
