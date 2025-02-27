import { useEffect } from "react";

const DebugMonitor = ({ componentName }) => {
  useEffect(() => {
    console.log(`[DEBUG] ${componentName} mounted`);

    return () => {
      console.log(`[DEBUG] ${componentName} unmounted`);
    };
  }, [componentName]);

  return null; // This component doesn't render anything
};

export default DebugMonitor;
