"use client";

import React from "react";

interface LoadingSpinnerProps {
  size?: "small" | "medium" | "large";
  text?: string;
  fullScreen?: boolean;
  color?: "green" | "blue" | "purple" | "amber";
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "medium",
  text = "Loading...",
  fullScreen = false,
  color = "green",
}) => {
  // Determine spinner size
  const spinnerSizeClasses = {
    small: "h-8 w-8",
    medium: "h-12 w-12",
    large: "h-16 w-16",
  };

  // Determine text size
  const textSizeClasses = {
    small: "text-sm",
    medium: "text-base",
    large: "text-xl",
  };

  // Determine color
  const colorClasses = {
    green: "border-green-500 dark:border-green-400",
    blue: "border-blue-500 dark:border-blue-400",
    purple: "border-purple-500 dark:border-purple-400",
    amber: "border-amber-500 dark:border-amber-400",
  };

  // Container classes based on fullScreen prop
  const containerClasses = fullScreen
    ? "flex flex-col items-center justify-center h-[95vh] w-full bg-white dark:bg-zinc-900"
    : "flex flex-col items-center justify-center py-8";

  return (
    <div className={containerClasses}>
      <div className="relative flex flex-col items-center">
        <div
          className={`${spinnerSizeClasses[size]} mb-3 border-t-4 border-b-4 ${colorClasses[color]} rounded-full animate-spin`}
        ></div>
        <div
          className={`absolute top-0 left-0 ${spinnerSizeClasses[size]} border-t-4 border-b-4 border-white dark:border-zinc-800 rounded-full animate-pulse opacity-30`}
        ></div>

        {text && (
          <h2
            className={`${textSizeClasses[size]} font-semibold text-gray-700 dark:text-gray-200 mt-4 animate-pulse`}
          >
            {text.endsWith("...") ? text.slice(0, -3) : text}
            <span className="inline-flex">
              <span className="animate-[bounce_1s_ease-in-out_infinite]">
                .
              </span>
              <span className="animate-[bounce_1s_ease-in-out_0.2s_infinite]">
                .
              </span>
              <span className="animate-[bounce_1s_ease-in-out_0.4s_infinite]">
                .
              </span>
            </span>
          </h2>
        )}
      </div>
    </div>
  );
};

export default LoadingSpinner;
