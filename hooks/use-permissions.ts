'use client';

import { useEffect, useState } from 'react';

interface AppPermission {
  id: string;
  enabled: boolean;
}

interface FeaturePermission {
  id: string;
  enabled: boolean;
}

interface UsePermissionsReturn {
  hasFeatureAccess: (featureId: string) => boolean;
  hasAppAccess: (appId: string) => boolean;
  isLoading: boolean;
  permissions: {
    appPermissions: AppPermission[];
    featurePermissions: FeaturePermission[];
  };
}

export function usePermissions(): UsePermissionsReturn {
  const [permissions, setPermissions] = useState<{
    appPermissions: AppPermission[];
    featurePermissions: FeaturePermission[];
  }>({
    appPermissions: [],
    featurePermissions: []
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        const response = await fetch('/api/worker/permissions');
        const data = await response.json();
        setPermissions({
          appPermissions: data.appPermissions || [],
          featurePermissions: data.featurePermissions || []
        });
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, []);

  const hasFeatureAccess = (featureId: string): boolean => {
    const permission = permissions.featurePermissions.find(feature => feature.id === featureId);
    return permission?.enabled || false;
  };

  const hasAppAccess = (appId: string): boolean => {
    const permission = permissions.appPermissions.find(app => app.id === appId);
    return permission?.enabled || false;
  };

  return {
    hasFeatureAccess,
    hasAppAccess,
    isLoading,
    permissions
  };
}
