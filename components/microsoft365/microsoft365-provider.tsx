"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { PublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { msalConfig, loginRequest } from "@/lib/msal-config";
import { Microsoft365Service } from "@/lib/microsoft365-service";

interface Microsoft365ContextType {
  isAuthenticated: boolean;
  user: AccountInfo | null;
  m365Service: Microsoft365Service | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const Microsoft365Context = createContext<Microsoft365ContextType | undefined>(undefined);

const msalInstance = new PublicClientApplication(msalConfig);

export function Microsoft365Provider({ children }: { children: React.ReactNode }) {
  return (
    <MsalProvider instance={msalInstance}>
      <Microsoft365ContextProvider>{children}</Microsoft365ContextProvider>
    </MsalProvider>
  );
}

function Microsoft365ContextProvider({ children }: { children: React.ReactNode }) {
  const { instance, accounts } = useMsal();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [m365Service, setM365Service] = useState<Microsoft365Service | null>(null);

  const isAuthenticated = accounts.length > 0;
  const user = accounts[0] || null;

  useEffect(() => {
    if (isAuthenticated && !m365Service) {
      const service = new Microsoft365Service();
      setM365Service(service);
    } else if (!isAuthenticated && m365Service) {
      setM365Service(null);
    }
  }, [isAuthenticated, m365Service]);

  const login = async () => {
    setLoading(true);
    setError(null);
    try {
      await instance.loginPopup(loginRequest);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await instance.logoutPopup();
      setM365Service(null);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Logout failed");
    } finally {
      setLoading(false);
    }
  };

  const value: Microsoft365ContextType = {
    isAuthenticated,
    user,
    m365Service,
    login,
    logout,
    loading,
    error,
  };

  return (
    <Microsoft365Context.Provider value={value}>
      {children}
    </Microsoft365Context.Provider>
  );
}

export function useMicrosoft365() {
  const context = useContext(Microsoft365Context);
  if (context === undefined) {
    throw new Error("useMicrosoft365 must be used within a Microsoft365Provider");
  }
  return context;
}
