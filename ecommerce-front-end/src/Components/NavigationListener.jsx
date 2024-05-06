
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function NavigationListener({ setLoading }) {
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    // Introduce a delay before setting loading back to false
    const timer = setTimeout(() => setLoading(false), 500); // 1 second delay
    return () => clearTimeout(timer);
  }, [location, setLoading]);

  return null; // This component doesn't render anything
}

export default NavigationListener;