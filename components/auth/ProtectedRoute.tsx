'use client';

import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // TODO: Add actual authentication check
  // For now, just render the children
  return <>{children}</>;
}
