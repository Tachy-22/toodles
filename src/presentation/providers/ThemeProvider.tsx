"use client";
import React, { ReactNode } from "react";
import { Theme } from "@radix-ui/themes";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return <Theme>{children}</Theme>;
};

export default ThemeProvider;
