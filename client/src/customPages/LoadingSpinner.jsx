import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const LoadingSpinner = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500); 
    return () => clearTimeout(timeout);
  }, [location]);

  return (
    loading && (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    )
  );
};

export default LoadingSpinner;
