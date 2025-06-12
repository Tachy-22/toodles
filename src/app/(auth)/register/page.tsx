import dynamic from "next/dynamic";
import React from "react";

// Use dynamic import with ssr: false to prevent hydration issues
const RegisterPage = dynamic(
  () => import("@/presentation/layout/RegisterPage"),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    ),
  }
);

// Disable static generation for this page
export const dynamic = "force-dynamic";

const page = () => {
  return <RegisterPage />;
};

export default page;
