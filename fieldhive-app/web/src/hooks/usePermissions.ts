/**
 * Hook for checking user permissions
 * Currently simplified to give super admins unrestricted access
 */

import { useAuth } from './useAuth';
import { UserRole, UserRoles } from '@/services/base.service';

export function usePermissions() {
  const { userRole } = useAuth();

  const can = (roles: UserRole | UserRole[]): boolean => {
    if (!userRole) return false;

    // Super admins always have access
    if (userRole === UserRoles.SUPER_ADMIN) {
      return true;
    }

    // For other roles, check if they have the required role
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    return allowedRoles.includes(userRole);
  };

  return { can };
}
