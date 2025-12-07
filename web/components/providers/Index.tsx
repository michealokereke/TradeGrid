"use client";

import React from "react";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { ThemeProvider } from "next-themes";
import AuthProvider from "./AuthProvider";

const ProviderEntry = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem={true}
        storageKey="TradeGrid_theme"
      >
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </Provider>
  );
};

export default ProviderEntry;
