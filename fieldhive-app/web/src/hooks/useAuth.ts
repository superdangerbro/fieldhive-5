/**
 * Hook for managing authentication state and user data.
 * Provides real-time updates for both Firebase Authentication and Firestore user data.
 * 
 * @returns {Object} Authentication state and user data
 * @property {User | null} user - Firebase Auth user object
 * @property {UserData | null} userData - User data from Firestore
 * @property {UserRole} userRole - Current user's role, defaults to CLIENT if not set
 * @property {boolean} isAdmin - Whether the user has admin privileges
 * @property {boolean} loading - Whether the auth state is still being determined
 */

import { useAuth as useAuthContext } from '@/components/auth/AuthProvider';
import { UserRoles } from '@/services/base.service';

export function useAuth() {
  const auth = useAuthContext();

  return {
    ...auth,
    isAdmin: auth.userRole === UserRoles.ADMIN || auth.userRole === UserRoles.SUPER_ADMIN,
  };
}
