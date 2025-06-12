"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { Theme } from "@radix-ui/themes";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // This ensures the Theme component only renders on the client
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same structure to avoid layout shift
    return <div className="contents">{children}</div>;
  }

  return <Theme>{children}</Theme>;
};

export default ThemeProvider;
