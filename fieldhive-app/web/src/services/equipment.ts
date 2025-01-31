import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  getDocs
} from 'firebase/firestore';
import { BaseService, UserRoles } from './base.service';

export interface EquipmentType {
  id: string;
  name: string;
  description: string;
  fields: {
    name: string;
    type: string;
    required: boolean;
    options?: string[];
  }[];
}

export interface EquipmentCategory {
  id: string;
  name: string;
  order: number;
  equipmentTypes: EquipmentType[];
}

const TYPES_COLLECTION = 'equipmentTypes';

class EquipmentService extends BaseService {
  async getCategories(): Promise<EquipmentCategory[]> {
    try {
      console.log('Getting equipment types...');
      await this.requireAuth();
      
      const typesQuery = query(
        collection(db, TYPES_COLLECTION)
      );
      
      const snapshot = await getDocs(typesQuery);
      const types = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as EquipmentType[];

      // For now, put all types in a single category
      const category: EquipmentCategory = {
        id: 'default',
        name: 'All Equipment Types',
        order: 1,
        equipmentTypes: types
      };

      console.log('Equipment types loaded:', types);
      return [category];
    } catch (error) {
      console.error('Error getting equipment types:', error);
      throw error;
    }
  }

  async addCategory(name: string): Promise<string> {
    try {
      console.log('Adding equipment type:', name);
      await this.requireRole([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);
      
      const docRef = await addDoc(collection(db, TYPES_COLLECTION), {
        name,
        description: '',
        fields: []
      });
      
      console.log('Equipment type added with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error adding equipment type:', error);
      throw error;
    }
  }

  async updateCategory(id: string, data: Partial<EquipmentType>): Promise<void> {
    try {
      console.log('Updating equipment type:', { id, data });
      await this.requireRole([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);
      const docRef = doc(db, TYPES_COLLECTION, id);
      await updateDoc(docRef, data);
      console.log('Equipment type updated successfully');
    } catch (error) {
      console.error('Error updating equipment type:', error);
      throw error;
    }
  }

  async deleteCategory(id: string): Promise<void> {
    try {
      console.log('Deleting equipment type:', id);
      await this.requireRole([UserRoles.ADMIN, UserRoles.SUPER_ADMIN]);
      const docRef = doc(db, TYPES_COLLECTION, id);
      await deleteDoc(docRef);
      console.log('Equipment type deleted successfully');
    } catch (error) {
      console.error('Error deleting equipment type:', error);
      throw error;
    }
  }
}

export const equipmentService = new EquipmentService();
