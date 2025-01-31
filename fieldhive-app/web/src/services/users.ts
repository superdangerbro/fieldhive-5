import { BaseService, UserRoles } from './base.service';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';

interface User {
  id: string;
  email: string;
  role: UserRoles;
  displayName?: string;
}

class UserService extends BaseService {
  private usersCollection = collection(db, 'users');

  async getUsers(): Promise<User[]> {
    const snapshot = await getDocs(this.usersCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as User));
  }

  async updateUser(user: User): Promise<void> {
    const { id, ...data } = user;
    const userRef = doc(this.usersCollection, id);
    await updateDoc(userRef, data);
  }
}

export const userService = new UserService();
