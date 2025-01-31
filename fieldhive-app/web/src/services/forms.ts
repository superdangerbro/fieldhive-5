import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BaseService } from './base.service';
import {
  FieldDefinition,
  FormTemplate,
  FormCategory,
  FormSubCategory,
  FormRule,
} from '@/types/forms';

class FormService extends BaseService {
  // Field Registry Operations
  async getFieldDefinitions(category: string, subcategoryId?: string) {
    const q = subcategoryId
      ? query(
          collection(db, 'fieldRegistry'),
          where('category', '==', category),
          where('subcategoryId', '==', subcategoryId)
        )
      : query(
          collection(db, 'fieldRegistry'),
          where('category', '==', category)
        );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FieldDefinition[];
  }

  async createFieldDefinition(field: Omit<FieldDefinition, 'id' | 'metadata' | 'usageStats'>) {
    const userId = await this.getCurrentUserId();
    const fieldData = {
      ...field,
      metadata: {
        createdAt: serverTimestamp(),
        createdBy: userId,
        updatedAt: serverTimestamp(),
        updatedBy: userId,
      },
      usageStats: {
        forms: [],
        count: 0,
      },
    };

    const docRef = await addDoc(collection(db, 'fieldRegistry'), fieldData);
    return docRef.id;
  }

  async updateFieldDefinition(id: string, updates: Partial<FieldDefinition>) {
    const userId = await this.getCurrentUserId();
    const docRef = doc(db, 'fieldRegistry', id);
    
    await updateDoc(docRef, {
      ...updates,
      'metadata.updatedAt': serverTimestamp(),
      'metadata.updatedBy': userId,
    });
  }

  // Form Template Operations
  async getFormTemplates(categoryId: string, subcategoryId?: string) {
    const q = subcategoryId
      ? query(
          collection(db, 'formTemplates'),
          where('categoryId', '==', categoryId),
          where('subcategoryId', '==', subcategoryId)
        )
      : query(
          collection(db, 'formTemplates'),
          where('categoryId', '==', categoryId)
        );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FormTemplate[];
  }

  async createFormTemplate(template: Omit<FormTemplate, 'id' | 'metadata'>) {
    const userId = await this.getCurrentUserId();
    const templateData = {
      ...template,
      metadata: {
        createdAt: serverTimestamp(),
        createdBy: userId,
        updatedAt: serverTimestamp(),
        updatedBy: userId,
      },
    };

    const docRef = await addDoc(collection(db, 'formTemplates'), templateData);
    return docRef.id;
  }

  async updateFormTemplate(id: string, updates: Partial<FormTemplate>) {
    const userId = await this.getCurrentUserId();
    const docRef = doc(db, 'formTemplates', id);
    
    await updateDoc(docRef, {
      ...updates,
      'metadata.updatedAt': serverTimestamp(),
      'metadata.updatedBy': userId,
    });
  }

  // Category Operations
  async getCategories() {
    const snapshot = await getDocs(collection(db, 'formCategories'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FormCategory[];
  }

  async createCategory(category: Omit<FormCategory, 'id' | 'metadata'>) {
    const userId = await this.getCurrentUserId();
    const categoryData = {
      ...category,
      metadata: {
        createdAt: serverTimestamp(),
        createdBy: userId,
        updatedAt: serverTimestamp(),
        updatedBy: userId,
      },
    };

    const docRef = await addDoc(collection(db, 'formCategories'), categoryData);
    return docRef.id;
  }

  // Subcategory Operations
  async getSubCategories(categoryId: string) {
    const q = query(
      collection(db, 'formSubCategories'),
      where('categoryId', '==', categoryId)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FormSubCategory[];
  }

  async createSubCategory(subcategory: Omit<FormSubCategory, 'id' | 'metadata'>) {
    const userId = await this.getCurrentUserId();
    const subcategoryData = {
      ...subcategory,
      metadata: {
        createdAt: serverTimestamp(),
        createdBy: userId,
        updatedAt: serverTimestamp(),
        updatedBy: userId,
      },
    };

    const docRef = await addDoc(collection(db, 'formSubCategories'), subcategoryData);
    return docRef.id;
  }
}

export const formService = new FormService();
