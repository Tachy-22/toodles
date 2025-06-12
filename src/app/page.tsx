import React from "react";
import dynamic from "next/dynamic";

// Use dynamic import with ssr: false to prevent hydration issues
const HomePage = dynamic(() => import("@/presentation/layout/HomePage"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[calc(100vh-4.5rem)]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  ),
});

// Disable static generation for this page
export const dynamicConfig = "force-dynamic";

const page = () => {
  return <HomePage />;
};

export default page;
