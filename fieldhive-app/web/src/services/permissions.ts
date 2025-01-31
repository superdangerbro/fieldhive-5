/**
 * Permissions Service
 * 
 * Manages role-based permissions in the system.
 * Provides functionality to:
 * - Load and save role permissions
 * - Check if a role has a specific permission
 * - Update role permissions
 */

import { db } from '@/lib/firebase';
import { collection, doc, getDoc, setDoc, getDocs } from 'firebase/firestore';
import { UserRole } from './base.service';
import { Permission, SystemPermissions } from '@/types/permissions';

interface RolePermissions {
  role: UserRole;
  permissions: string[]; // Array of permission IDs
  updatedAt: string;
}

class PermissionsService {
  private permissionsCache: Map<UserRole, Set<string>> = new Map();

  /**
   * Initialize permissions for all roles with default values.
   * Only needs to be called once when setting up the system.
   */
  async initializeDefaultPermissions() {
    const batch = [];
    
    // Group permissions by role
    const defaultPermissionsByRole = new Map<UserRole, Set<string>>();
    
    SystemPermissions.forEach(permission => {
      permission.defaultRoles.forEach(role => {
        if (!defaultPermissionsByRole.has(role)) {
          defaultPermissionsByRole.set(role, new Set());
        }
        defaultPermissionsByRole.get(role)?.add(permission.id);
      });
    });

    // Create permission documents for each role
    for (const [role, permissions] of defaultPermissionsByRole) {
      const rolePermissions: RolePermissions = {
        role,
        permissions: Array.from(permissions),
        updatedAt: new Date().toISOString(),
      };
      
      batch.push(
        setDoc(doc(db, 'role-permissions', role), rolePermissions)
      );
    }

    await Promise.all(batch);
  }

  /**
   * Load permissions for a specific role.
   */
  private async loadRolePermissions(role: UserRole): Promise<Set<string>> {
    const cached = this.permissionsCache.get(role);
    if (cached) return cached;

    const docRef = doc(db, 'role-permissions', role);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      // If no permissions are set, use defaults
      const defaultPerms = new Set(
        SystemPermissions
          .filter(p => p.defaultRoles.includes(role))
          .map(p => p.id)
      );
      this.permissionsCache.set(role, defaultPerms);
      return defaultPerms;
    }

    const permissions = new Set(docSnap.data().permissions);
    this.permissionsCache.set(role, permissions);
    return permissions;
  }

  /**
   * Check if a role has a specific permission.
   */
  async hasPermission(role: UserRole, permissionId: string): Promise<boolean> {
    const permissions = await this.loadRolePermissions(role);
    return permissions.has(permissionId);
  }

  /**
   * Update permissions for a role.
   */
  async updateRolePermissions(role: UserRole, permissions: string[]) {
    const rolePermissions: RolePermissions = {
      role,
      permissions,
      updatedAt: new Date().toISOString(),
    };

    await setDoc(doc(db, 'role-permissions', role), rolePermissions);
    this.permissionsCache.set(role, new Set(permissions));
  }

  /**
   * Get all permissions for a role.
   */
  async getRolePermissions(role: UserRole): Promise<string[]> {
    const permissions = await this.loadRolePermissions(role);
    return Array.from(permissions);
  }

  /**
   * Get all available permissions in the system.
   */
  getSystemPermissions(): Permission[] {
    return SystemPermissions;
  }

  /**
   * Clear the permissions cache.
   */
  clearCache() {
    this.permissionsCache.clear();
  }
}

export const permissionsService = new PermissionsService();
