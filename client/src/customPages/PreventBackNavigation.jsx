import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PreventBackNavigation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleBackButton = () => {
      navigate(1); // Prevent going back by forcing forward navigation
    };

    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handleBackButton);

    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [navigate]);

  return null;
};

export default PreventBackNavigation;
