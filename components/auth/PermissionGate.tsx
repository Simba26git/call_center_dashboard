'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/use-permissions';

interface PermissionGateProps {
  children: ReactNode;
  feature?: string;
  app?: string;
  fallback?: ReactNode;
}

export function PermissionGate({ children, feature, app, fallback = null }: PermissionGateProps) {
  const { hasFeatureAccess, hasAppAccess, isLoading } = usePermissions();

  if (isLoading) {
    return <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>;
  }

  let hasAccess = true;

  if (feature && !hasFeatureAccess(feature)) {
    hasAccess = false;
  }

  if (app && !hasAppAccess(app)) {
    hasAccess = false;
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

// Convenience components for common use cases
export function FeatureGate({ children, feature, fallback = null }: { children: ReactNode; feature: string; fallback?: ReactNode }) {
  return <PermissionGate feature={feature} fallback={fallback}>{children}</PermissionGate>;
}

export function AppGate({ children, app, fallback = null }: { children: ReactNode; app: string; fallback?: ReactNode }) {
  return <PermissionGate app={app} fallback={fallback}>{children}</PermissionGate>;
}
