'use client';

import { ReactNode } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { UserRole } from '@/services/base.service';
import { CircularProgress } from '@mui/material';

interface RequirePermissionProps {
  children: ReactNode;
  roles: UserRole | UserRole[];
  fallback?: ReactNode;
  showLoading?: boolean;
}

export default function RequirePermission({
  children,
  roles,
  fallback = null,
  showLoading = false,
}: RequirePermissionProps) {
  const { can, isLoading } = usePermissions();

  if (isLoading && showLoading) {
    return <CircularProgress size={20} />;
  }

  if (!can(roles)) {
    return fallback;
  }

  return <>{children}</>;
}
