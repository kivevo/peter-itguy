import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { activityTracker } from "@/services/activityTracker";

export const AnalyticsTracker: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    activityTracker.recordPageView(location.pathname);
  }, [location.pathname]);

  return null;
};

export default AnalyticsTracker;
