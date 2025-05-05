
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center max-w-md mx-auto p-6">
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-400 mb-6">The page you're looking for doesn't exist</p>
        <Button asChild>
          <a href="/">Return to Presentation</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
