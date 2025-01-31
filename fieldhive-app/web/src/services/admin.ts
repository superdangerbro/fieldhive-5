/**
 * Admin Service
 * 
 * Provides functionality for system administrators to manage users.
 * This service is only accessible to users with ADMIN or SUPER_ADMIN roles.
 */

import { db } from '@/lib/firebase';
import { collection, doc, updateDoc, getDocs } from 'firebase/firestore';
import { UserRole, UserRoles } from './base.service';

interface User {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  company?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Human-readable labels for user roles.
 * Used in the UI to display role names.
 */
export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRoles.CLIENT]: 'Client',
  [UserRoles.PROPERTY_MANAGER]: 'Property Manager',
  [UserRoles.TECHNICIAN]: 'Technician',
  [UserRoles.ADMIN]: 'Administrator',
  [UserRoles.SUPER_ADMIN]: 'Super Administrator',
};

class AdminService {
  /**
   * Retrieves all users from the system.
   * @returns {Promise<User[]>} Array of user objects
   */
  async getUsers(): Promise<User[]> {
    const usersRef = collection(db, 'users');
    const snapshot = await getDocs(usersRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
  }

  /**
   * Updates a user's role.
   * @param {string} userId - The ID of the user to update
   * @param {UserRole} role - The new role to assign
   */
  async updateUserRole(userId: string, role: UserRole) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      role,
      updatedAt: new Date().toISOString()
    });
  }
}

export const adminService = new AdminService();
