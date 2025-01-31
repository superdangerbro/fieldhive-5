/**
 * Base Service Class and Role Management
 * 
 * This module defines the role-based access control system for FieldHive.
 * It includes role definitions, role hierarchy, and base service functionality
 * for authentication and authorization.
 */

import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { NotAuthenticatedError, InsufficientPermissionsError } from '@/errors/auth';

/**
 * Available user roles in the system.
 * Roles are hierarchical, with each role having access to capabilities
 * of roles below it in the hierarchy.
 */
export const UserRoles = {
  CLIENT: 'client',                  // Basic access to view equipment
  PROPERTY_MANAGER: 'property_manager', // Manage properties and view equipment
  TECHNICIAN: 'technician',          // Manage equipment and perform maintenance
  ADMIN: 'admin',                    // Full system access
  SUPER_ADMIN: 'super_admin',        // System + user management
} as const;

/**
 * Role hierarchy defines the access level of each role.
 * Higher numbers indicate more permissions.
 * A user with a role can perform actions of roles with lower numbers.
 */
export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [UserRoles.CLIENT]: 1,
  [UserRoles.PROPERTY_MANAGER]: 2,
  [UserRoles.TECHNICIAN]: 3,
  [UserRoles.ADMIN]: 4,
  [UserRoles.SUPER_ADMIN]: 5,
};

export type UserRole = typeof UserRoles[keyof typeof UserRoles];

/**
 * Base service class providing authentication and authorization functionality.
 * Other services should extend this class to inherit these capabilities.
 */
export class BaseService {
  /**
   * Ensures the user is authenticated.
   * @throws {NotAuthenticatedError} If user is not authenticated
   */
  protected async requireAuth() {
    if (!auth.currentUser) {
      throw new NotAuthenticatedError();
    }
  }

  /**
   * Checks if the user has the required role(s).
   * Uses role hierarchy - a user with a higher role can perform actions of lower roles.
   * 
   * @param allowedRoles Single role or array of roles required for the action
   * @throws {InsufficientPermissionsError} If user lacks required role(s)
   */
  protected async requireRole(allowedRoles: UserRole | UserRole[]) {
    await this.requireAuth();
    const userRole = await this.getUserRole();

    // Super admins always have access
    if (userRole === UserRoles.SUPER_ADMIN) {
      console.log('User is super admin, allowing access');
      return;
    }

    const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!roles.includes(userRole)) {
      console.log('Permission check failed:');
      console.log('- User role:', userRole);
      console.log('- Allowed roles:', roles);
      console.log('- Is super admin?', userRole === UserRoles.SUPER_ADMIN);
      throw new InsufficientPermissionsError(roles);
    }
  }

  /**
   * Gets the user's current role.
   * @returns {Promise<UserRole>} The user's role, defaults to CLIENT
   */
  protected async getUserRole(): Promise<UserRole> {
    if (!auth.currentUser) {
      console.log('No current user, returning CLIENT role');
      return UserRoles.CLIENT;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (!userDoc.exists()) {
        console.log('User document not found');
        return UserRoles.CLIENT;
      }

      const data = userDoc.data();
      const role = data?.role;
      
      console.log('User document data:', data);
      console.log('Role from Firestore:', role);
      console.log('Role type:', typeof role);
      console.log('Is role super_admin?', role === UserRoles.SUPER_ADMIN);
      console.log('Role comparison:', {
        role,
        super_admin: UserRoles.SUPER_ADMIN,
        isEqual: role === UserRoles.SUPER_ADMIN
      });

      return role || UserRoles.CLIENT;
    } catch (error) {
      console.error('Error getting user role:', error);
      return UserRoles.CLIENT;
    }
  }

  /**
   * Checks if the user has admin privileges.
   * @returns {Promise<boolean>} True if user is ADMIN or SUPER_ADMIN
   */
  protected async isAdmin(): Promise<boolean> {
    try {
      await this.requireRole([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if the user has technician privileges.
   * @returns {Promise<boolean>} True if user is TECHNICIAN, ADMIN, or SUPER_ADMIN
   */
  protected async isTechnician(): Promise<boolean> {
    try {
      await this.requireRole([UserRoles.TECHNICIAN, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Checks if the user has property manager privileges.
   * @returns {Promise<boolean>} True if user is PROPERTY_MANAGER, ADMIN, or SUPER_ADMIN
   */
  protected async isPropertyManager(): Promise<boolean> {
    try {
      await this.requireRole([UserRoles.PROPERTY_MANAGER, UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Handles errors by re-throwing them as instances of Error.
   * @param error The error to handle
   * @throws {Error} The handled error
   */
  protected handleError(error: unknown): never {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}
