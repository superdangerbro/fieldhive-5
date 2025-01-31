/**
 * Permission Management Types
 * 
 * Defines the structure for managing role-based permissions in the UI.
 * Each permission represents a specific action or access right in the system.
 */

import { UserRole } from '@/services/base.service';

export interface Permission {
  id: string;           // Unique identifier for the permission
  name: string;         // Human-readable name
  description: string;  // Detailed description of what this permission allows
  category: string;     // Grouping category (e.g., 'Equipment', 'Users', 'Reports')
  defaultRoles: UserRole[]; // Default roles that have this permission
}

// Define all available permission categories
export const PermissionCategories = {
  EQUIPMENT: 'Equipment',
  USERS: 'Users',
  PROPERTIES: 'Properties',
  REPORTS: 'Reports',
  SETTINGS: 'Settings',
} as const;

// Define all available permissions
export const SystemPermissions: Permission[] = [
  // Equipment Permissions
  {
    id: 'equipment.view',
    name: 'View Equipment',
    description: 'View equipment details and specifications',
    category: PermissionCategories.EQUIPMENT,
    defaultRoles: ['client', 'property_manager', 'technician', 'admin', 'super_admin'],
  },
  {
    id: 'equipment.create',
    name: 'Create Equipment',
    description: 'Add new equipment to the system',
    category: PermissionCategories.EQUIPMENT,
    defaultRoles: ['technician', 'admin', 'super_admin'],
  },
  {
    id: 'equipment.edit',
    name: 'Edit Equipment',
    description: 'Modify existing equipment details',
    category: PermissionCategories.EQUIPMENT,
    defaultRoles: ['technician', 'admin', 'super_admin'],
  },
  {
    id: 'equipment.delete',
    name: 'Delete Equipment',
    description: 'Remove equipment from the system',
    category: PermissionCategories.EQUIPMENT,
    defaultRoles: ['admin', 'super_admin'],
  },
  
  // User Management Permissions
  {
    id: 'users.view',
    name: 'View Users',
    description: 'View user profiles and details',
    category: PermissionCategories.USERS,
    defaultRoles: ['admin', 'super_admin'],
  },
  {
    id: 'users.create',
    name: 'Create Users',
    description: 'Add new users to the system',
    category: PermissionCategories.USERS,
    defaultRoles: ['admin', 'super_admin'],
  },
  {
    id: 'users.edit',
    name: 'Edit Users',
    description: 'Modify user details',
    category: PermissionCategories.USERS,
    defaultRoles: ['admin', 'super_admin'],
  },
  {
    id: 'users.delete',
    name: 'Delete Users',
    description: 'Remove users from the system',
    category: PermissionCategories.USERS,
    defaultRoles: ['super_admin'],
  },

  // Property Management Permissions
  {
    id: 'properties.view',
    name: 'View Properties',
    description: 'View property details',
    category: PermissionCategories.PROPERTIES,
    defaultRoles: ['property_manager', 'technician', 'admin', 'super_admin'],
  },
  {
    id: 'properties.create',
    name: 'Create Properties',
    description: 'Add new properties to the system',
    category: PermissionCategories.PROPERTIES,
    defaultRoles: ['admin', 'super_admin'],
  },
  {
    id: 'properties.edit',
    name: 'Edit Properties',
    description: 'Modify property details',
    category: PermissionCategories.PROPERTIES,
    defaultRoles: ['property_manager', 'admin', 'super_admin'],
  },
  {
    id: 'properties.delete',
    name: 'Delete Properties',
    description: 'Remove properties from the system',
    category: PermissionCategories.PROPERTIES,
    defaultRoles: ['admin', 'super_admin'],
  },

  // Report Permissions
  {
    id: 'reports.view',
    name: 'View Reports',
    description: 'Access system reports',
    category: PermissionCategories.REPORTS,
    defaultRoles: ['property_manager', 'technician', 'admin', 'super_admin'],
  },
  {
    id: 'reports.create',
    name: 'Create Reports',
    description: 'Generate new reports',
    category: PermissionCategories.REPORTS,
    defaultRoles: ['technician', 'admin', 'super_admin'],
  },
  {
    id: 'reports.export',
    name: 'Export Reports',
    description: 'Export reports to different formats',
    category: PermissionCategories.REPORTS,
    defaultRoles: ['admin', 'super_admin'],
  },

  // Settings Permissions
  {
    id: 'settings.view',
    name: 'View Settings',
    description: 'View system settings',
    category: PermissionCategories.SETTINGS,
    defaultRoles: ['admin', 'super_admin'],
  },
  {
    id: 'settings.edit',
    name: 'Edit Settings',
    description: 'Modify system settings',
    category: PermissionCategories.SETTINGS,
    defaultRoles: ['super_admin'],
  },
  {
    id: 'permissions.manage',
    name: 'Manage Permissions',
    description: 'Configure role-based permissions',
    category: PermissionCategories.SETTINGS,
    defaultRoles: ['super_admin'],
  },
];
